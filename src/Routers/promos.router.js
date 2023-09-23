const express = require("express");
const promosRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")

const {getAllPromos,
  createNewPromo,
  EditPromo,
  deletePromo,} = require("../Handlers/promos.handler")

promosRouter.get("/", getAllPromos);

promosRouter.post("/create", createNewPromo);

promosRouter.patch("/update/:id", EditPromo);

promosRouter.delete("/delete/:id", deletePromo);


module.exports = promosRouter;