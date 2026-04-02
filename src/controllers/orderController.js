const orderService = require("../services/orderService");

async function getAllOrders(req, res) {
  const orders = await orderService.getAllOrders();
  return res.json({
    success: true,
    data: orders,
  });
}

module.exports = {
  getAllOrders,
};
