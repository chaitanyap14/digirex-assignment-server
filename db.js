require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DB,
  port: process.env.DB_PORT,
  password: process.env.DB_PASS,
});

module.exports = pool;
