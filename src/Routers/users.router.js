const express = require("express");
const usersRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")
const {singleUpload} = require("../Middlewares/diskUpload");

const {getUsers,
    register,
    updateUser,
    deleteUser,
    userlogin, 
    userActivation, 
    userLogout, 
    addUser, 
    getUserPorfile, 
    resetPassword,
    newPassword,
    updateUserByAdmin} = require('../Handlers/users.handler')

usersRouter.post("/register", register);
usersRouter.post("/login", userlogin);
usersRouter.post("/forgetpassword", resetPassword);
usersRouter.post("/resetpassword", newPassword);
usersRouter.get("/verification", userActivation);
usersRouter.delete("/logout", userLogout);
usersRouter.get("/",isLogin, isAdmin, getUsers);
usersRouter.get("/profile",isLogin, getUserPorfile);
usersRouter.post("/",isLogin, isAdmin, singleUpload("user_photo_profile"),addUser);
usersRouter.patch("/",isLogin, singleUpload("user_photo_profile"), updateUser);
usersRouter.patch("/update",isLogin, singleUpload("user_photo_profile"), updateUserByAdmin);
usersRouter.delete("/:id",isLogin, isAdmin, deleteUser);

module.exports = usersRouter;
