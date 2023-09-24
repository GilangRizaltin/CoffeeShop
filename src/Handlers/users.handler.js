const {insert, read, update, del, totalData, login, updateUsername, pwd} = require("../Models/users.model")
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const {jwtKey, issuerWho} = require("../Configs/environtment")
const { sendMail } = require("../Utils/sendMail");

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
      const totalUser = parseInt(muchData.rows[0].total_user);
      const lastPage = Math.ceil(totalUser / 4) <= parseInt(query.page);
      const meta = {
      page: parseInt(query.page) || 1,
      totalUser: totalUser,
      next: lastPage ? null : "",
      prev: parseInt(query.page) === 1 ? null : ""
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

const register = async (req, res) => {
  try {
    const {body} = req;
    const hashedPassword = await argon.hash(body.password)
    const data = await insert(body, hashedPassword);
    const createdUser = data.rows[0];
    const OTP = Math.floor(100000 + Math.random() * 900000);
    res.status(201).json({
      msg: `User berhasil dibuat. id anda = ${createdUser.id} dengan nama : ${createdUser.full_name}`,
      result: createdUser,
      check: "Silahkan cek email dab lakukan aktivasi"
    });
    const info = await sendMail({
      to: body.email,
      subject: "Email Activation",
      data: {
        username: body.username,
        activationLink: "https",
        OTP_Number: OTP
      }
    });
    req.userInfo = OTP
  } catch (error) {
    if (error.code === "23505" && error.constraint === "users_user_name_key") {
      return res.status(400).json({
        msg: "Username already exist"
      });
    };
    if (error.code === "23505" && error.constraint === "users_phone_key") {
      return res.status(400).json({
        msg: "Phone number has been previously registered"
      });
    };
    if (error.code === "23505" && error.constraint === "users_email_key") {
      return res.status(400).json({
        msg: "E-mail already registered"
      });
    } res.status(500).json({
      msg: "Internal server error",
    });console.log(error);
  };
};

const updateUserName = async (req,res) => {
  const {body} = req;
  const {user_name, user_type} = req.userInfo;
      await updateUsername(user_name, body);
      const payload = {
      user_name, user_type, 
      };
      payload.user_name = body.user_name;
      jwt.sign(payload, jwtKey,{
        expiresIn: '10m',
        issuer: issuerWho,
      }, (error, token) => {
        if (error) throw error;
        res.status(200).json({
          msg: `Successfullly change username`,
          data: {
            token
          }
        });
      });
}

const updateUser = async (req, res) => {
  try {
    const {user_name} = req.userInfo;
    const {body} = req;
    let hashedPwd = null;
    if (body.password_user) {
      const data = await pwd(user_name);
      const {password_user} = data.rows[0]
      if (!await argon.verify(password_user, body.last_password))
      return res.status(404).json({
        msg: "Password Unmatched"
      });
      hashedPwd = await argon.hash(body.password_user);
    };
    const result = await update(user_name, body, hashedPwd);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `User dengan username ${user_name} tidak ditemukan`,
      });
    }
    res.status(201).json({
      msg: `Successfully update data for ${result.rows[0].full_name}`,
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

const userlogin = async (req, res) => {
  try {
    const {body} = req;
    const result = await login(body);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: "Invalid data"
      });
    };
    const {password_user, user_name, user_type} = result.rows[0];
    if (!await argon.verify(password_user, body.password)) {
      return res.status(401).json({
        msg: "Invalid E-mail or Password"
      });
    };
    const payload = {
      user_name, user_type, 
    };
    jwt.sign(payload, jwtKey,{
      expiresIn: '10m',
      issuer: issuerWho,
    }, (error, token) => {
      if (error) throw error;
      res.status(200).json({
        msg: "Successfully Login",
        data: {
          token
        }
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
    const {user_name, user_type} = req.userInfo;
  } catch (error) {
    
  }

}

  module.exports = {
    getUsers,
    register,
    updateUser,
    deleteUser,
    userlogin,
    updateUserName
};