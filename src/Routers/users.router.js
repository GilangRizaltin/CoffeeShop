const express = require("express");
const usersRouter = express.Router();

const {getUsers,
  addNewUser,
  updateUser,
  deleteUser} = require('../Handlers/users.handler')

usersRouter.get("/:page", getUsers);

usersRouter.post("/create", addNewUser);

usersRouter.patch("/update/:id", updateUser);

usersRouter.delete("/delete/:id", deleteUser);


module.exports = usersRouter;
