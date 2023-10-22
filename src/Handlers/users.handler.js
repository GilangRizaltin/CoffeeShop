const {registering, read, update, del, totalData, login, pwd, verification, userActive, out, afterVerification, insert, profile} = require("../Models/users.model")
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const {jwtKey, issuerWho} = require("../Configs/environtment")
const { sendMail } = require("../Utils/sendMail");

const register = async (req, res) => {
  try {
    const {body} = req;
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await argon.hash(body.password);
    const data = await registering(body, hashedPassword, OTP);
    const createdUser = data.rows[0];
    const info = await sendMail({
      to: body.email,
      subject: "Email Activation",
      data: {
        username: body.username,
        activationLink: `http://localhost:9000/users/verification/?email=${body.email}&OTP`,
        OTP_Number: OTP
      }
    });
    res.status(201).json({
      msg: `User successfully creaated. Your ID = ${createdUser.id} with full name : ${createdUser.full_name}`,
      check: "Please check E-mail and activated"
    });
//    req.userInfo = OTP
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
        if(error.constraint === "users_user_name_key") {
            return res.status(400).json({
            msg: "Username already exists"
      })
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

const userlogin = async (req, res) => {
  try {
    const {body} = req;
    const result = await login(body);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: "Invalid data"
      });
    };
    let activated = await userActive(body);
    if (activated.rows[0].activated === false) {
      res.status(400).json({
        msg: "Please activate email first"
      });
    }
    const {password_user, id, user_type} = result.rows[0];
    if (!await argon.verify(password_user, body.password)) {
      return res.status(401).json({
        msg: "Invalid E-mail or Password"
      });
    };
    const payload = {
      id, user_type, 
    };
    const userId = result.rows[0].id;
    const userName = result.rows[0].user_name;
    const photo = result.rows[0].user_photo_profile;
    jwt.sign(payload, jwtKey,{
      expiresIn: '20m',
      issuer: issuerWho,
    }, (error, token) => {
      if (error) throw error;
//      console.log(activated)
      res.status(200).json({
        msg: "Successfully Login",
        data: {
          token,
          userId,
          userName,
          photo,
        },
      });
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
}

const userActivation = async (req, res) => {
  try {
    const {query} = req;
    const Otp = parseInt(query.OTP)
    const verif = await verification(query)
    if (Otp !== verif.rows[0].otp) {
      return res.status(404).json({
      msg: "Incorrect OTP"
    })};
    const success = await afterVerification(query)
    res.status(201).json({
      msg: "Activation completed"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
};

const userLogout = async (req, res) => {
  try {
  const bearer = req.header("Authorization")
  const token = bearer.split(" ")[1];
  const logout = await out(token);
  res.status(200).json({
    msg: `Log out success. Thank you`
  })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
}

const getUsers = async (req,res,next) => {
  try {
    const {query} = req;
      const result = await read(query);
      const muchData = await totalData(query)
      if (result.rowCount === 0) {
        return res.status(404).json({
          msg: "Data not found"
        });
      };
      let pages = 1;
      if (query.page) {
        pages = parseInt(query.page)
      }
      const totalUser = parseInt(muchData.rows[0].total_user);
      const nextPage = pages + 1;
      const prevPage = pages - 1;
      const lastPage = Math.ceil(totalUser / 4) <= pages;
      const meta = {
      page: pages,
      totalUser: totalUser,
      next: lastPage ? null : `http://localhost:9000${req.originalUrl.slice(0, -1) + nextPage}`,
      prev: pages === 1 || (!query.page) ? null : `http://localhost:9000${req.originalUrl.slice(0, -1) + prevPage}`
      };
      res.status(200).json({
          msg: "Success",
          result: result.rows,
          meta
      })
  } catch (error) {
    console.log(error);
      res.status(500).json({
          msg: "Internal Server Error",
      })
  }
};

const getUserPorfile = async (req, res) => {
  try {
    const {id} = req.userInfo;
    const result = await profile(id)
    res.status(200).json({
      msg:"Success",
      res: result.rows
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg:"Internal Error",
    })
  }
}

const addUser = async (req, res) => {
  try {
    const {body} = req;
    let fileLink = "";
    if (!req.file.filename) {
    fileLink = `/public/img/product-image-1695610823722-801707897.png`
    }
    fileLink = `/public/img/${req.file.filename}`;
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





  module.exports = {getUsers,register,updateUser,deleteUser,userlogin,userActivation,userLogout, addUser, getUserPorfile};