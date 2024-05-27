const mysql = require("mysql");
const dotenv = require("dotenv").config();

const connection_uri = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};
const db_connection = mysql.createConnection(connection_uri);

module.exports = db_connection;
