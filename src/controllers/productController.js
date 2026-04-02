const productServie = require("../services/productService");

async function getAllProducts(req, res) {
  const { category_id } = req.query;
  const products = await productServie.getAllProducts(category_id);
  return res.json({
    success: true,
    data: products,
  });
}

async function getNewProducts(req, res) {
  const { category_id } = req.query;
  const products = await productServie.getNewProducts(category_id);
  return res.json({
    success: true,
    data: products,
  });
}

async function getFeaturedProducts(req, res) {
  const { category_id } = req.query;
  const products = await productServie.getFeaturedProducts(category_id);
  return res.json({
    success: true,
    data: products,
  });
}

async function getBestSellingProducts(req, res) {
  const { category_id } = req.query;
  const products = await productServie.getBestSellingProducts(category_id);
  return res.json({
    success: true,
    data: products,
  });
}

async function getProductsWithBestDeals(req, res) {
  const { category_id } = req.query;
  const products = await productServie.getProductsWithBestDeals(category_id);
  return res.json({
    success: true,
    data: products,
  });
}

async function getProductById(req, res) {
  const id = req.params.id;
  const result = await productServie.getProductById(id);

  if (result.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  return res.json({
    success: true,
    data: result[0],
  });
}

async function addProduct(req, res) {
  const product = req.body;
  const image = req.file;

  const result = await productServie.addProduct(product, image);
  return res.status(201).json({
    success: true,
    data: result,
  });
}

async function deleteProduct(req, res) {
  const id = req.params.id;
  const affectedRows = await productServie.deleteProduct(id);

  if (affectedRows > 0) {
    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  }
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}

async function updateProduct(req, res) {
  const id = req.params.id;
  const product = req.body;
  const image = req.file;

  const affectedRows = await productServie.updateProduct(id, product, image);

  if (affectedRows > 0) {
    return res.json({
      success: true,
      message: "Product data updated successfully",
    });
  }
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}

module.exports = {
  getAllProducts,
  getNewProducts,
  getFeaturedProducts,
  getBestSellingProducts,
  getProductsWithBestDeals,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
};
