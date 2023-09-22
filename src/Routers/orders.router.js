const express = require("express");
const ordersRouter = express.Router();

const {getAllOrders, softDeleteOrder,transactions, updateStat} = require("../Handlers/orders.handler")

ordersRouter.get("/", getAllOrders);

ordersRouter.post("/:user_id", transactions);

ordersRouter.patch("/", updateStat);

ordersRouter.delete("/", softDeleteOrder);



module.exports = ordersRouter;