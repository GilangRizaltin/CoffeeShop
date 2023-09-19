const express = require("express");
const ordersProductRouter = express.Router();

const {getAllOrdersProducts,
  deleteOrderProduct,
  insertOrderProduct, updateQuantity} = require("../Handlers/orders_products.handler")

ordersProductRouter.get("/", getAllOrdersProducts);

ordersProductRouter.post("/create", insertOrderProduct);

ordersProductRouter.patch("/update", updateQuantity);

ordersProductRouter.delete("/delete/:id", deleteOrderProduct);

module.exports = ordersProductRouter;