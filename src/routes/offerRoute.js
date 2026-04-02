const router = require("express").Router();
const upload = require("../middleware/multer");

const validate = require("../middleware/validator");
const asyncHandler = require("../utils/asyncHandler");

const commonSchema = require("../validators/commonSchema");
const offerSchema = require("../validators/offerSchema");
const offerController = require("../controllers/offerController");
const authHandler = require("../middleware/authHandler");

router.get(
  "/",
  validate(commonSchema.getByCategoryOptional),
  asyncHandler(offerController.getAllOffers),
);

router.get(
  "/:id",
  validate(commonSchema.getById),
  asyncHandler(offerController.getOfferById),
);

router.post(
  "/",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  upload.none(),
  validate(offerSchema.addOffer),
  asyncHandler(offerController.addOffer),
);

router.delete(
  "/:id",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  validate(commonSchema.deleteSomething),
  asyncHandler(offerController.deleteOffer),
);

router.put(
  "/:id",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  upload.none(),
  validate(offerSchema.updateOffer),
  asyncHandler(offerController.updateOffer),
);

module.exports = router;
