const express = require("express");
const ordersRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")

const {getAllOrders, softDeleteOrder,transactions, updateStat} = require("../Handlers/orders.handler")
const {getAllOrdersProducts,deleteOrderProduct,updateQuantity} = require("../Handlers/orders_products.handler")

ordersRouter.get("/",isLogin, isAdmin, getAllOrders);

ordersRouter.post("/",isLogin, isNormalUser, transactions);

ordersRouter.patch("/:id",isLogin, isAdmin, updateStat);

ordersRouter.delete("/:id",isLogin, isAdmin, softDeleteOrder);

ordersRouter.get("/",isLogin, isAdmin, getAllOrdersProducts);

ordersRouter.patch("/:id",isLogin, isAdmin, updateQuantity);

ordersRouter.delete("/:id",isLogin, isAdmin, deleteOrderProduct);

module.exports = ordersRouter;