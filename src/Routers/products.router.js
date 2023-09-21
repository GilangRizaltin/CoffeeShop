const express = require("express");
const productsRouter = express.Router();

const {getProducts, addProducts,
  updateProducts, deleteProducts,
popularProducts} = require("../Handlers/products.handler")

productsRouter.get("/", getProducts);

productsRouter.post("/", addProducts);

productsRouter.patch("/:id", updateProducts);

productsRouter.delete("/:id", deleteProducts);

productsRouter.get("/popular", popularProducts);



module.exports = productsRouter;