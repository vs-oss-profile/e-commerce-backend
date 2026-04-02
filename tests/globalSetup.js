const db = require("../src/clients/db");
const bcrypt = require("bcrypt");
const { client: redisClient, connectRedis } = require("../src/clients/redis");
const config = require("../src/utils/config");

beforeAll(async () => {
  await connectRedis();
});

afterAll(async () => {
  await db.end();
  await redisClient.quit();
});

beforeEach(async () => {
  await db.execute("SET FOREIGN_KEY_CHECKS = 0");
  await db.execute("TRUNCATE TABLE category");
  await db.execute("TRUNCATE TABLE product");
  await db.execute("TRUNCATE TABLE offer");
  await db.execute("TRUNCATE TABLE user");
  await db.execute("TRUNCATE TABLE customer");
  await db.execute("TRUNCATE TABLE review");
  await db.execute("TRUNCATE TABLE `order`");
  await db.execute("TRUNCATE TABLE orderItem");
  await db.execute("SET FOREIGN_KEY_CHECKS = 1");

  // add two categories: home, electronics
  await db.execute(`
    INSERT INTO category (name, description, image)
    VALUES
    ("home", "home category description", "home.png"),
    ("electronics", "computers and stuff", "electronics.png")`);

  // add two users: admin1, customer1
  const adminPassword = await bcrypt.hash("admin", config.app.saltRounds);
  const customerPassword = await bcrypt.hash("customer", config.app.saltRounds);
  await db.execute(
    `INSERT INTO user (username, password, role)
    VALUES
    ("admin1", ?, "admin"),
    ("customer1", ?, "customer")`,
    [adminPassword, customerPassword],
  );
});
