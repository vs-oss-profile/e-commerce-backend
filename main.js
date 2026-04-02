const app = require("./src/app");
const { connectRedis } = require("./src/clients/redis");
const logger = require("./src/utils/logger");
const config = require("./src/utils/config");

async function main() {
  await connectRedis();
  app.listen(config.app.port, () => {
    logger.info("listening on port:", config.app.port);
  });
}

main();
