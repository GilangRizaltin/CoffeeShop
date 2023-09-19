const express = require("express");
const productsRouter = express.Router();

const {getProducts, addProducts,
  updateProducts, deleteProducts,
  searchProducts, popularProducts,
  pageProducts, orderProductBy} = require("../Handlers/products.handler")

productsRouter.get("/", getProducts);

productsRouter.post("/", addProducts);

productsRouter.patch("/:id", updateProducts);

productsRouter.delete("/delete/:id", deleteProducts);

productsRouter.get("/search", searchProducts);

productsRouter.get("/popular", popularProducts);

productsRouter.get("/page", pageProducts);

productsRouter.get("/orderby",orderProductBy);

module.exports = productsRouter;