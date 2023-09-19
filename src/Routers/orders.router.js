const express = require("express");
const ordersRouter = express.Router();

const {getAllOrders, softDeleteOrder, pageOrders, transactions, subtotal, total_transaction, createOrder} = require("../Handlers/orders.handler")

ordersRouter.get("/", getAllOrders);

ordersRouter.post("/create/:user_id", createOrder);

ordersRouter.patch("/delete", softDeleteOrder);

ordersRouter.get("/page", pageOrders);

ordersRouter.post("/transaction/:user_id", transactions);

ordersRouter.patch("/update/subtotal", subtotal);

ordersRouter.patch("/update/total_transactions", total_transaction);

module.exports = ordersRouter;