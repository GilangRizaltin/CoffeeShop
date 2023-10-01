const express = require("express");
const productsRouter = express.Router();
const {isLogin, isAdmin} = require("../Middlewares/authorization");
const {singleUpload, multiUpload} = require("../Middlewares/diskUpload");

const {getProducts, addProducts,
  updateProducts, deleteProducts,
popularProducts, updateProductImage} = require("../Handlers/products.handler")

productsRouter.get("/", getProducts);

productsRouter.post("/",isLogin, isAdmin, multiUpload("product_image", 3), addProducts);

productsRouter.patch("/:id",isLogin, isAdmin,  updateProducts);

productsRouter.patch("/image/:id",isLogin, isAdmin,  singleUpload("product_image"), updateProductImage);

productsRouter.delete("/:id",isLogin, isAdmin, deleteProducts);

productsRouter.get("/popular",isLogin, popularProducts);

module.exports = productsRouter;