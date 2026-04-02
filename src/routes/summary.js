const router = require("express").Router();
const db = require("../db/db");

router.get("/", async (req, res) => {
  const [order_items] = await db.query("SELECT * FROM order_item");
  const [products] = await db.query("SELECT * FROM product");
  const [users] = await db.query("SELECT * FROM user");
  const [orders] = await db.query("SELECT * FROM `order`");

  return res.json({
    productsSold: order_items.length,
    totalProducts: products.length,
    totalUsers: users.length,
    totalOrders: orders.length,
  });
});

module.exports = router;
