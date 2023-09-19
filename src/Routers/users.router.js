const express = require("express");
const usersRouter = express.Router();

const {getUsers,
  addNewUser,
  updateUser,
  deleteUser,
  pageUsers} = require('../Handlers/users.handler')

usersRouter.get("/", getUsers);

usersRouter.post("/create", addNewUser);

usersRouter.patch("/update/:id", updateUser);

usersRouter.delete("/delete/:id", deleteUser);

usersRouter.get("/page", pageUsers);

module.exports = usersRouter;
