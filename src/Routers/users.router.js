const express = require("express");
const usersRouter = express.Router();

const {getUsers,
  register,
  updateUser,
  deleteUser} = require('../Handlers/users.handler')

usersRouter.get("/", getUsers);

usersRouter.post("/create", register);

usersRouter.patch("/update/:id", updateUser);

usersRouter.delete("/delete/:id", deleteUser);


module.exports = usersRouter;
