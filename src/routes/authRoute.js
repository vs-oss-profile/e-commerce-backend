const router = require("express").Router();
const upload = require("../middleware/multer");

const validate = require("../middleware/validator");
const asyncHandler = require("../utils/asyncHandler");

const authSchema = require("../validators/authSchema");
const authController = require("../controllers/authController");

router.post(
  "/login",
  upload.none(),
  validate(authSchema.login),
  asyncHandler(authController.login),
);

router.post(
  "/signup",
  upload.none(),
  validate(authSchema.signup),
  asyncHandler(authController.signup),
);

router.post("/refresh", upload.none(), asyncHandler(authController.refresh));

// TODO: logout

module.exports = router;
