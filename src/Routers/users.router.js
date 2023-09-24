const express = require("express");
const usersRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")

const {getUsers,
  register,
  updateUser,
  deleteUser,
  userlogin, updateUserName} = require('../Handlers/users.handler')

usersRouter.get("/",isLogin, isAdmin, getUsers);

usersRouter.post("/", register);

usersRouter.patch("/",isLogin, updateUser);

usersRouter.patch("/username",isLogin, updateUserName);

usersRouter.delete("/:id",isLogin, isAdmin, deleteUser);

usersRouter.post("/login", userlogin);


module.exports = usersRouter;
