const express = require("express");
const usersRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")

const {getUsers,register,updateUser,deleteUser,userlogin, updateUserName, userActivation, userLogout} = require('../Handlers/users.handler')



usersRouter.post("/", register);

usersRouter.post("/login", userlogin);

usersRouter.get("/verification", userActivation);

usersRouter.get("/logout", userLogout);

usersRouter.get("/",isLogin, isAdmin, getUsers);

usersRouter.patch("/",isLogin, updateUser);

usersRouter.patch("/username",isLogin, updateUserName);

usersRouter.delete("/:id",isLogin, isAdmin, deleteUser);





module.exports = usersRouter;
