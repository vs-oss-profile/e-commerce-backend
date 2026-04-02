const db = require("../clients/db");
const apiError = require("../utils/apiError");

async function getAllOrders() {
  const [rows] = await db.execute(
    `SELECT first_name, last_name, \`order\`.status as order_status, \`order\`.created_at as \`timestamp\`
    FROM \`order\`
    JOIN customer
    ON \`order\`.customer_id = customer.customer_id`,
  );
  return rows;
}

async function getOrderByCustomer(user_id) {
  // TODO
}

async function name(params) {}

module.exports = {
  getAllOrders,
};
