const app = require("./src/app");
const { initRedis } = require("./src/clients/redis");
const { initDbPool } = require("./src/clients/db");
const logger = require("./src/utils/logger");
const config = require("./src/utils/config");

async function main() {
  await initDbPool();
  await initRedis();
  app.listen(config.app.port, () => {
    logger.info("listening on port:", config.app.port);
  });
}

main();
