const pg = require("pg");

const {dbHost, dbName, dbUser, dbPw,} = require("./environtment");

const {Pool} = pg;
const db = new Pool ({
    host : dbHost,
    database: dbName,
    user: dbUser,
    password : dbPw,
});

module.exports = db;