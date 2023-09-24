const express = require("express");
const ordersRouter = express.Router();
const {isLogin, isAdmin, isNormalUser} = require("../Middlewares/authorization")

const {getAllOrders, softDeleteOrder,transactions, updateStat} = require("../Handlers/orders.handler")

ordersRouter.get("/",isLogin, isAdmin, getAllOrders);

ordersRouter.post("/:user_id",isLogin, isNormalUser, transactions);

ordersRouter.patch("/",isLogin, isAdmin, updateStat);

ordersRouter.delete("/",isLogin, isAdmin, softDeleteOrder);



module.exports = ordersRouter;