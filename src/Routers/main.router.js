const express = require("express");
const mainRouter = express.Router();

const productsRouter = require("./products.router");
const usersRouter = require("./users.router");
const authRouter = require("./auth.router");
const promosRouter = require("./promos.router");
const ordersRouter = require("./orders.router");
const ordersProductRouter = require("./orders_product.router");
const {popularProducts, getStatistic} = require("../Handlers/products.handler")

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

mainRouter.use("/auth", authRouter);
mainRouter.use("/product", productsRouter);
mainRouter.use("/user", usersRouter);
mainRouter.use("/promo", promosRouter);
mainRouter.use("/order", ordersRouter);
mainRouter.use("/orderproduct", ordersProductRouter);

mainRouter.use("/statistic", popularProducts);
module.exports = mainRouter;