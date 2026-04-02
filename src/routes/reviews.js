const router = require("express").Router();
const queryDB = require("../utils/utils");

router.get("/view", (req, res) => {
  queryDB(
    `SELECT product.name as product, first_name, last_name, review
    FROM review
    JOIN product ON review.product_id = product.product_id
    JOIN customer ON review.customer_id = customer.customer_id`,
    req,
    res,
  );
});

module.exports = router;
