require("dotenv").config();
//import express
const express = require("express"); // mengambil library express

//generate express aplication
const server = express();

server.use(express.static("./public"));

//parser untuk json dan url encode
server.use(express.json());
server.use(express.urlencoded({extended: false}));

const cors = require("cors");
server.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["PATCH","POST", "DELETE"],
  })
);

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

