const express = require("express");
const productsRouter = express.Router();
const {isLogin, isAdmin} = require("../Middlewares/authorization");
const {singleUpload} = require("../Middlewares/diskUpload");

const {getProducts, addProducts,
  updateProducts, deleteProducts,
popularProducts} = require("../Handlers/products.handler")

productsRouter.get("/", getProducts);

productsRouter.post("/",isLogin, isAdmin, singleUpload("product-image"), addProducts);

productsRouter.patch("/:id",isLogin, isAdmin, singleUpload("product-image"), updateProducts);

productsRouter.delete("/:id",isLogin, isAdmin, deleteProducts);

productsRouter.get("/popular",isLogin, popularProducts);

module.exports = productsRouter;