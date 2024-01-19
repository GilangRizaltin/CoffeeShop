const {registering, login, verification, userActive, out, afterVerification} = require("../Models/auth.model")
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const {jwtKey, issuerWho} = require("../Configs/environtment")
const { sendMail } = require("../Utils/sendMail");
const { resetPwdMail } = require("../Utils/resetPwdMail")
const {getPagination, newResponse} = require("../Utils/response")

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
        return res.status(400).json({
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
      // const userId = result.rows[0].id;
      const userEmail = body.email;
      const userFullName = result.rows[0].full_name;
      const photo = result.rows[0].user_photo_profile;
      const type = result.rows[0].user_type;
      jwt.sign(payload, jwtKey,{
        expiresIn: '30m',
        issuer: issuerWho,
      }, (error, token) => {
        if (error) throw error;
  //      console.log(activated)
      const data= {
        token: token,
        email: userEmail,
        fullname: userFullName,
        photo_profile: photo,
        type: type,
      }
      const response = newResponse(`Welcome ${result.rows[0].full_name}`, data, null);
        res.status(200).json(response)
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

module.exports = {register, userlogin, userActivation, userLogout}