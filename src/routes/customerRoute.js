const router = require("express").Router();
const upload = require("../middleware/multer");
const validate = require("../middleware/validator");
const authHandler = require("../middleware/authHandler");

const customerController = require("../controllers/customerController");
const customerSchema = require("../validators/customerSchema");
const commonSchema = require("../validators/commonSchema");
const asyncHandler = require("../utils/asyncHandler");

router.get(
  "/",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  asyncHandler(customerController.getAllCustomers),
);

router.get(
  "/:id",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  validate(commonSchema.getById),
  asyncHandler(customerController.getCustomerById),
);

// router.post(
//   "/",
//   upload.none(),
//   validate(customerSchema.addCustomer),
//   asyncHandler(customerController.addCustomer),
// );

router.delete(
  "/:id",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  validate(commonSchema.deleteSomething),
  asyncHandler(customerController.deleteCustomer),
);

router.put(
  "/:id",
  upload.none(),
  validate(customerSchema.updateCustomer),
  asyncHandler(customerController.updateCustomer),
);

router;

module.exports = router;
