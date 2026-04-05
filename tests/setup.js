const { getDbPool, initDbPool } = require("../src/clients/db");
const bcrypt = require("bcrypt");
const config = require("../src/utils/config");
const { initRedis, getRedisClient } = require("../src/clients/redis");
const app = require("../src/app");

let db;

beforeAll(async () => {
  await initDbPool();
  await initRedis();
  db = await getDbPool();
});

afterAll(async () => {
  await db.end();
  await getRedisClient().quit();
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

  // add a category
  await db.execute(
    `INSERT INTO category (name, description, image)
    VALUES
    ("category1", "category one description", "file_example_PNG_500kB.png")`,
  );

  // add two users: admin1, customer1
  const adminPassword = await bcrypt.hash("admin1", config.app.saltRounds);
  const customerPassword = await bcrypt.hash(
    "customer1",
    config.app.saltRounds,
  );
  await db.execute(
    `INSERT INTO user (username, password, role)
    VALUES
    ("admin1", ?, "admin"),
    ("customer1", ?, "customer")`,
    [adminPassword, customerPassword],
  );

  // add customer1 details
  await db.execute(
    `INSERT INTO customer (user_id, first_name, last_name, email, mobile, address, pin)
    VALUES (2, "Customer", "One", "customer1@example.com", "+919876543211", "123 Main St, Area, State", "999999")`,
  );
});
