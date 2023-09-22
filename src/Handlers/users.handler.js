const {insert, read, update, del, totalData, login} = require("../Models/users.model")
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const {jwtKey, issuerWho} = require("../Configs/environtment")

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
      const meta = {
        page: query.page,
        totalUser: muchData.rows[0].total_user,
        next: "",
        prev: ""
      }
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
    res.status(201).json({
      msg: `User berhasil dibuat. id anda = ${createdUser.id} dengan nama : ${createdUser.full_name}`,
      result: createdUser,
    });
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

const updateUser = async (req, res) => {
  try {
    const { params, body } = req;
    let hashedPwd = null;
    if (body.password_user) {
      hashedPwd = await argon.hash(body.password_user);
    }
    const result = await update(params, body, hashedPwd);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `User dengan id ${params.id} tidak ditemukan`,
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
      user_name, user_type
    };
    jwt.sign(payload, jwtKey,{
      expiresIn: '10m'
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

  module.exports = {
    getUsers,
    register,
    updateUser,
    deleteUser,
    userlogin
};