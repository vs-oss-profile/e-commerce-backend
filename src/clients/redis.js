const { createClient } = require("redis");
const logger = require("../utils/logger");

const client = createClient();

client.on("error", (err) => {
  logger.error("Redis Client Error", err);
});

async function initRedis() {
  try {
    await client.connect();
    logger.info("Redis client connected");
  } catch (err) {
    logger.error("Couldn't connect to redis client");
  }
}

function getRedisClient() {
  return client;
}

module.exports = {
  initRedis,
  getRedisClient,
};
