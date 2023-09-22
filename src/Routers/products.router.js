const express = require("express");
const productsRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")

const {getProducts, addProducts,
  updateProducts, deleteProducts,
popularProducts} = require("../Handlers/products.handler")

productsRouter.get("/", getProducts);

productsRouter.post("/", isLogin, isAdmin, addProducts);

productsRouter.patch("/:id", isLogin, isAdmin, updateProducts);

productsRouter.delete("/:id", isLogin, isAdmin, deleteProducts);

productsRouter.get("/popular", isLogin, popularProducts);



module.exports = productsRouter;