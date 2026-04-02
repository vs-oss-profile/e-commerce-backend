const router = require("express").Router();
const upload = require("../middleware/multer");

const validate = require("../middleware/validator");
const asyncHandler = require("../utils/asyncHandler");

const productController = require("../controllers/productController");
const productSchema = require("../validators/productSchema");
const commonSchema = require("../validators/commonSchema");
const authHandler = require("../middleware/authHandler");

router.get(
  "/",
  validate(commonSchema.getByCategoryOptional),
  asyncHandler(productController.getAllProducts),
);

router.get(
  "/new",
  validate(commonSchema.getByCategoryOptional),
  asyncHandler(productController.getNewProducts),
);

router.get(
  "/featured",
  validate(commonSchema.getByCategoryOptional),
  asyncHandler(productController.getFeaturedProducts),
);

router.get(
  "/best-sellers",
  validate(commonSchema.getByCategoryOptional),
  asyncHandler(productController.getBestSellingProducts),
);

router.get(
  "/best-deals",
  validate(commonSchema.getByCategoryOptional),
  asyncHandler(productController.getProductsWithBestDeals),
);

router.get(
  "/:id",
  validate(commonSchema.getById),
  asyncHandler(productController.getProductById),
);

router.post(
  "/",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  upload.single("image"),
  validate(productSchema.addProduct),
  asyncHandler(productController.addProduct),
);

router.delete(
  "/:id",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  validate(commonSchema.deleteSomething),
  asyncHandler(productController.deleteProduct),
);

router.put(
  "/:id",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  upload.single("image"),
  validate(productSchema.updateProduct),
  asyncHandler(productController.updateProduct),
);

module.exports = router;
