const Razorpay = require("razorpay");
const router = require("express").Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_aro7DmNCYha043",
  key_secret: "WbMUfLsVEcKVp7IF1nJpNU3a",
});

router.get("/", async (req, res) => {
  const options = {
    amount: 100 * 100,
    currency: "INR",
  };
  const order = await razorpay.orders.create(options);
  res.json(order);
});

module.exports = router;
