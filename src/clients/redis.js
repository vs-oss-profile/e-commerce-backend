const { createClient } = require("redis");
const logger = require("../utils/logger");

const client = createClient();

client.on("error", (err) => {
  logger.error("Redis Client Error", err);
});

async function connectRedis() {
  try {
    await client.connect();
    logger.info("Redis client connected");
  } catch (err) {
    logger.error("Couldn't connect to redis client");
  }
}

module.exports = {
  client,
  connectRedis,
};
