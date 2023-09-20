const express = require("express");
const productsRouter = express.Router();

const {getProducts, addProducts,
  updateProducts, deleteProducts,
popularProducts, filterby} = require("../Handlers/products.handler")

productsRouter.get("/", getProducts);

productsRouter.post("/", addProducts);

productsRouter.patch("/:id", updateProducts);

productsRouter.delete("/:id", deleteProducts);

productsRouter.get("/popular", popularProducts);

productsRouter.get("/filter/:name/:minprice/:maxprice/:page", filterby);


module.exports = productsRouter;