const router = require("express").Router();
const upload = require("../middleware/multer");

const validate = require("../middleware/validator");
const asyncHandler = require("../utils/asyncHandler");

const orderSchema = require("../validators/orderSchema");
const orderController = require("../controllers/orderController");

router.get("/", asyncHandler(orderController.getAllOrders));

router.post("/", upload.none(), (req, res) => {
  const { customer_id, product_id, quantity, purchase_price } = req.body;

  db.query(
    `SELECT * FROM \`order\` WHERE user_id = 1`,
    // [req.user.user_id],
    (err, results) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (results.length > 0) {
        const order = results[0];
        queryDB(
          `INSERT INTO order_item
          (order_id, product_id, quantity, purchase_price)
          VALUES
          (${order.order_id}, ${product_id}, ${quantity}, ${purchase_price})`,
          req,
          res,
        );
      } else {
        db.beginTransaction((err) => {
          if (err) {
            res.sendStatus(500);
            return;
          }
          db.query(
            `INSERT INTO order (customer_id)
            VALUES (?)`,
            [customer_id],
            (err, orderResults) => {
              if (err) {
                db.rollback();
                res.sendStatus(500);
                return;
              }
              const order_id = orderResults.insertId;
              db.query(
                `INSERT INTO order_item
                (order_id, product_id, quantity, purchase_price)
                VALUES
                (?, ?, ?, ?)`,
                [order_id, product_id, quantity, purchase_price],
                (err, results) => {
                  if (err) {
                    db.rollback();
                    res.sendStatus(500);
                    return;
                  }
                  db.commit((err) => {
                    if (err) {
                      db.rollback();
                      res.sendStatus(500);
                      return;
                    }
                    res.json(results);
                  });
                },
              );
            },
          );
        });
      }
    },
  );
});

module.exports = router;
