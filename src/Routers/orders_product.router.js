const express = require("express");
const ordersProductRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")

const {getAllOrdersProducts,
  deleteOrderProduct,
  updateQuantity} = require("../Handlers/orders_products.handler")

ordersProductRouter.get("/", getAllOrdersProducts);

ordersProductRouter.patch("/", updateQuantity);

ordersProductRouter.delete("/:id", deleteOrderProduct);

module.exports = ordersProductRouter;