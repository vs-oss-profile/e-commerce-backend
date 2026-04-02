const router = require("express").Router();
const upload = require("../middleware/multer");
const validate = require("../middleware/validator");

const categoryController = require("../controllers/categoryController");
const CategorySchema = require("../validators/categorySchema");
const commonSchema = require("../validators/commonSchema");
const asyncHandler = require("../utils/asyncHandler");
const authHandler = require("../middleware/authHandler");

router.get("/", asyncHandler(categoryController.getAllCategories));

router.get(
  "/:id",
  validate(commonSchema.getById),
  asyncHandler(categoryController.getCategoryById),
);

router.post(
  "/",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  upload.none(),
  validate(CategorySchema.addCategory),
  asyncHandler(categoryController.addCategory),
);

router.delete(
  "/:id",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  validate(commonSchema.deleteSomething),
  asyncHandler(categoryController.deleteCategory),
);

router.put(
  "/:id",
  authHandler.authenticate,
  authHandler.authorize("admin"),
  upload.none(),
  validate(CategorySchema.updateCategory),
  asyncHandler(categoryController.updateCategory),
);

module.exports = router;
