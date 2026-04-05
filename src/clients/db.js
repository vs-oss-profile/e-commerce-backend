const config = require("../utils/config");
const mysql = require("mysql2/promise");
const logger = require("../utils/logger");

let pool;

async function initDbPool() {
  if (!pool) {
    pool = mysql.createPool(config.db);

    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    logger.info("DB connected");
  }
  return pool;
}

async function getDbPool() {
  if (!pool) await initDbPool();
  return pool;
}

module.exports = { initDbPool, getDbPool };
