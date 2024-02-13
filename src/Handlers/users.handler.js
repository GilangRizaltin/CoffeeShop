const {registering, read, update, del, totalData, login, pwd, verification, userActive, out, afterVerification, insert, profile, updatebyAdmin} = require("../Models/users.model")
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const {jwtKey, issuerWho} = require("../Configs/environtment")
const { resetPwdMail } = require("../Utils/resetPwdMail")
const {getPagination, newResponse} = require("../Utils/response")


const getUsers = async (req,res) => {
  try {
    const {query} = req;
      const result = await read(query);
      const muchData = await totalData(query)
      if (result.rowCount === 0) {
        return res.status(404).json(newResponse("Data not found", null, null));
      };
      let pages = 1;
      if (query.page) {
        pages = parseInt(query.page)
      }
      const totalUser = parseInt(muchData.rows[0].total_user);
      const metaData = getPagination(req.originalUrl, totalUser, query.page, 6);

      // const nextPage = pages + 1;
      // const prevPage = pages - 1;
      // const lastPage = Math.ceil(totalUser / 4) <= pages;
      // const meta = {
      // page: pages,
      // totalUser: totalUser,
      // next: lastPage ? null : `http://localhost:9000${req.originalUrl.slice(0, -1) + nextPage}`,
      // prev: pages === 1 || (!query.page) ? null : `http://localhost:9000${req.originalUrl.slice(0, -1) + prevPage}`
      // };

      res.status(200).json(newResponse("Successfully Get User", result.rows, metaData))
  } catch (error) {
    console.log(error);
      res.status(500).json(newResponse("Internal Server Error", null, null))
  }
};

const getUserPorfile = async (req, res) => {
  try {
    const {id} = req.userInfo;
    const result = await profile(id)
    if (result.rows[0].length < 1) {
      return res.status(400).json(newResponse("Successfully Get Profile user", null, null))
    }
    res.status(200).json(newResponse("Data user not found", result.rows, null))
  } catch (error) {
    console.log(error);
    res.status(500).json(newResponse("Internal Server Error", null, null))
  }
}

const addUser = async (req, res) => {
  try {
    const {body} = req;
    let fileLink = "";
    if (!req.file.filename) {
    fileLink = `/img/product-image-1695610823722-801707897.png`
    }
    fileLink = `/img/${req.file.filename}`;
    const hashedPwd = await argon.hash(body.password);
    const result = await insert(fileLink, body, hashedPwd);
    res.status(201).json({
      msg: `User data with name ${body.full_name} successfully registered`
    })
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
        if(error.constraint === "users_user_name_key") {
            return res.status(400).json({
            msg: "Username already exists"
      })
    }
       if (error.constraint === "users_phone_key") {
      return res.status(400).json({
        msg: "Phone number has been previously registered"
      });
    }
    if (error.constraint === "users_email_key") {
      return res.status(400).json({
        msg: "E-mail already registered"
      });
    };   
    }
    res.status(500).json({
      msg: "Internal server error"
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const {id} = req.userInfo;
    const {body} = req;
    let fileLink = ``;
    if (req.file) {
    fileLink += `/img/${req.file.filename}`;
    };
    let hashedPwd = null;
    if (body.password_user) {
      const data = await pwd(id);
      const {password_user} = data.rows[0]
      if (!await argon.verify(password_user, body.last_password))
      return res.status(404).json({
        msg: "Password Unmatched"
      });
      hashedPwd = await argon.hash(body.password_user);
    };
    const result = await update(id, body, hashedPwd, fileLink);
    // if (result.rowCount === 0) {
    //   return res.status(404).json({
    //     msg: `User dengan username ${user_name} tidak ditemukan`,
    //   });
    // }
    res.status(201).json({
      msg: `Successfully update data for ${result.rows[0].full_name}`,
      data: body,
    });
  } catch (err) {
    if (err.code === "23505" ) {
      if (err.constraint === "users_user_name_key") {
        return res.status(400).json({
          msg: "Username already exist"
        });
      };
      if (err.constraint === "users_phone_key") {
        return res.status(400).json({
          msg: "Phone number already used"
        });
      };
      if (err.constraint === "users_email_key") {
        return res.status(400).json({
          msg: "E-mail already used"
        });
      };
    };
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const deleteUser = (req,res) => {
  const {params} = req;
  del(params)
  .then((data) => {
    if (data.rowCount === 0) {
      return res.status(404).json({
        msg: `Users dengan id ${params.id} tidak ditemukan.`,
      })
    } res.status(201).json({
      msg: `Users dengan id ${params.id} bernama ${data.rows[0].full_name} berhasil dihapus.`,
      });
  }).catch((err) => {
    console.log(err)
    res.status(500).json({
      msg: "Internal Server Error"
    });
  });
};

const resetPassword = async (req, res) => {
  try {
    const {query} = req;
    const data = await read(query);
    if (data.rows.length < 1) 
    return res.status(404).json({
      msg:"Your Account not Found"
    });
    // res.status(404).json({
    //   msg:"blablabla",
    //   data: data
    // });
    const info = await resetPwdMail({
      to: query.email,
      subject: "Reset Password",
      data: {
        username: data.rows[0].Username,
        activationLink: `http://localhost:5173/auth/password?email=${query.email}&otp=${data.rows[0].otp}`,
      }
    });
    res.status(200).json({
      msg: `Please check E-mail reset password`,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Internal Server Error"
    })
  }
}

const newPassword = async (req, res) => {
  try {
    const {body , query} = req;
    const data = await read(query)
    if (data.rows[0].otp !== parseInt(query.otp)) {
      return res.status(401).json({
        msg: "Your otp is wrong",
        data: data.rows[0].otp,
        otp: parseInt(query.otp)
      })
    }
    const id = data.rows[0].No;
    const hashedPwd = await argon.hash(body.password_user);
    const result = await update(id, body, hashedPwd);
    res.status(200).json({
      msg: `Password for ${query.email} complete updating `
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Internal Server Error"
    })
  }
}

const updateUserByAdmin = async (req, res) => {
  try {
    const {body} = req;
    let fileLink = ``;
    if (req.file) {
    fileLink += `/img/${req.file.filename}`;
    };
    let hashedPwd = null;
    const result = await update(body.id, body, hashedPwd, fileLink);
    // if (result.rowCount === 0) {
    //   return res.status(404).json({
    //     msg: `User dengan username ${user_name} tidak ditemukan`,
    //   });
    // }
    res.status(201).json({
      msg: `Successfully update data for ${result.rows[0].full_name}`,
      data: body,
    });
  } catch (err) {
    if (err.code === "23505" ) {
      if (err.constraint === "users_user_name_key") {
        return res.status(400).json({
          msg: "Username already exist"
        });
      };
      if (err.constraint === "users_phone_key") {
        return res.status(400).json({
          msg: "Phone number already used"
        });
      };
      if (err.constraint === "users_email_key") {
        return res.status(400).json({
          msg: "E-mail already used"
        });
      };
    };
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};


  module.exports = {getUsers,updateUser,deleteUser, addUser, getUserPorfile,resetPassword, updateUserByAdmin, newPassword};