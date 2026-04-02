const categoryService = require("../services/categoryService");

async function getAllCategories(req, res) {
  const categories = await categoryService.getAllCategories();
  return res.json({
    success: true,
    data: categories,
  });
}

async function getCategoryById(req, res) {
  const id = req.params.id;
  const result = await categoryService.getCategoryById(id);

  if (result.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }
  return res.json({
    success: true,
    data: result[0],
  });
}

async function addCategory(req, res) {
  const { name, description } = req.body;
  const result = await categoryService.addCategory(name, description);
  return res.status(201).json({
    success: true,
    data: result,
  });
}

async function deleteCategory(req, res) {
  const id = req.params.id;
  const affectedRows = await categoryService.deleteCategory(id);

  if (affectedRows > 0) {
    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  }
  return res.status(404).json({
    success: false,
    message: "Category not found",
  });
}

async function updateCategory(req, res) {
  const id = req.params.id;
  const category = req.body;

  const affectedRows = await categoryService.updateCategory(id, category);

  if (affectedRows > 0) {
    return res.json({
      success: true,
      message: "Category updated successfully",
    });
  }
  return res.status(404).json({
    success: false,
    message: "Category not found",
  });
}

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  deleteCategory,
  updateCategory,
};
