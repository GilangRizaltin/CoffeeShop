const express = require("express");
const ordersProductRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")

const {getAllOrdersProducts,
  deleteOrderProduct,
  updateQuantity} = require("../Handlers/orders_products.handler")

ordersProductRouter.get("/",isLogin, isAdmin, getAllOrdersProducts);

ordersProductRouter.patch("/:id",isLogin, isAdmin, updateQuantity);

ordersProductRouter.delete("/:id",isLogin, isAdmin, deleteOrderProduct);

module.exports = ordersProductRouter;