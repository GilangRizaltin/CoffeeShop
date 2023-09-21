require("dotenv").config();
//import express
const express = require("express"); // mengambil library express

//generate express aplication
const server = express();

//parser untuk json dan url encode
server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.listen(9000, () => {
  console.log("Server is running at port 9000");
});

const mainRouter = require("./src/Routers/main.router");
server.use(mainRouter);


server.get(
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
//Products

