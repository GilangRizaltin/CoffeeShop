const express = require("express");
const mainRouter = express.Router();

const productsRouter = require("./products.router");
const usersRouter = require("./users.router");
const promosRouter = require("./promos.router");
const ordersRouter = require("./orders.router");
const ordersProductRouter = require("./orders_product.router");
const authRouter = require("./auth.router")

mainRouter.get(
    "/",
    (req, res, next) => {
      console.log("mid 1");
      next();
    },
    (req, res, next) => {
      console.log("mid 2");
      next();
    },
    (req, res) => {
      console.log("last mid");
      res.send("This Is My Website holla")}
  );
  
mainRouter.use("/products", productsRouter);
mainRouter.use("/users", usersRouter);
mainRouter.use("/promos", promosRouter);
mainRouter.use("/orders", ordersRouter);
mainRouter.use("/orderproduct", ordersProductRouter);
// mainRouter.use("/auth", authRouter);

module.exports = mainRouter;