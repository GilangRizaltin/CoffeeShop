const express = require("express");
const ordersRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")

const {getAllOrders, softDeleteOrder,transactions, updateStat, getOrdersOnId} = require("../Handlers/orders.handler")
const {getAllOrdersProducts,deleteOrderProduct,updateQuantity} = require("../Handlers/orders_products.handler")

ordersRouter.get("/",isLogin, isAdmin, getAllOrders);

ordersRouter.get("/order",isLogin, getOrdersOnId);

ordersRouter.post("/",isLogin, transactions);

ordersRouter.patch("/:id",isLogin, isAdmin, updateStat);

ordersRouter.delete("/:id",isLogin, isAdmin, softDeleteOrder);

ordersRouter.get("/:order_id",isLogin, isAdmin, getAllOrdersProducts);

ordersRouter.patch("/:id",isLogin, isAdmin, updateQuantity);

ordersRouter.delete("/:id",isLogin, isAdmin, deleteOrderProduct);

module.exports = ordersRouter;