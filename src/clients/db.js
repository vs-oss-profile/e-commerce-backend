const config = require("../utils/config");
const mysql = require("mysql2/promise");

const pool = mysql.createPool(config.db);

module.exports = pool;
