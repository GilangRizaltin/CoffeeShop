const express = require("express");
const promosRouter = express.Router();

const {getAllPromos,
  createNewPromo,
  EditPromo,
  deletePromo,
  pagePromos} = require("../Handlers/promos.handler")

promosRouter.get("/", getAllPromos);

promosRouter.post("/create", createNewPromo);

promosRouter.patch("/update/:id", EditPromo);

promosRouter.delete("/delete/:id", deletePromo);

promosRouter.get("/page", pagePromos);

module.exports = promosRouter;