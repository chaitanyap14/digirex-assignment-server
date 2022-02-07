require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "medrecord",
  port: 5432,
  password: "root1412",
});

module.exports = pool;
