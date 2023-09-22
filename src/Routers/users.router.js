const express = require("express");
const usersRouter = express.Router();

const {getUsers,
  register,
  updateUser,
  deleteUser,
  userlogin} = require('../Handlers/users.handler')

usersRouter.get("/", getUsers);

usersRouter.post("/", register);

usersRouter.patch("/:id", updateUser);

usersRouter.delete("/:id", deleteUser);

usersRouter.post("/login", userlogin);


module.exports = usersRouter;
