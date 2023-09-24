const express = require("express");
const promosRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")

const {getAllPromos,
  createNewPromo,
  EditPromo,
  deletePromo,} = require("../Handlers/promos.handler")

promosRouter.get("/",isLogin, getAllPromos);

promosRouter.post("/",isLogin, isAdmin, createNewPromo);

promosRouter.patch("/:id",isLogin, isAdmin, EditPromo);

promosRouter.delete("/:id",isLogin, isAdmin, deletePromo);


module.exports = promosRouter;