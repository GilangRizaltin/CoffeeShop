const express = require("express");
const authRouter = express.Router();
const {register, userlogin, userActivation, userLogout} = require('../Handlers/auth.handler')

authRouter.post("/register", register);
authRouter.post("/acivate", userActivation);
authRouter.post("/login", userlogin);
authRouter.post("/logout", userLogout);

module.exports = authRouter;