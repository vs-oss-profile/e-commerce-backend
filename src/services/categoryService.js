const { getDbPool } = require("../clients/db");
const fs = require("fs/promises");
const path = require("path");
const apiError = require("../utils/apiError");

async function getAllCategories() {
  const db = await getDbPool();

  const [rows] = await db.execute("SELECT * FROM category");
  return rows;
}

async function getCategoryById(id) {
  const db = await getDbPool();

  const [rows] = await db.execute("SELECT * FROM category WHERE id = ?", [id]);
  return rows;
}

async function addCategory(categoryInfo, image) {
  const db = await getDbPool();

  const keys = Object.keys(categoryInfo).concat("image");
  const values = Object.values(categoryInfo).concat(image.filename);

  try {
    const [result] = await db.execute(
      `INSERT INTO category (${keys.join(", ")})
      VALUES (${keys.map((k) => "?").join(", ")})`,
      values,
    );
    return { id: result.insertId };
  } catch (err) {
    const imagePath = path.join(__dirname, `../../uploads/${image.filename}`);
    await fs.unlink(imagePath);

    if (err.code === "ER_DUP_ENTRY") {
      if (err.sqlMessage.includes("category.unique_category_name")) {
        throw apiError(409, "Category with this name already exists");
      }
    }

    throw err;
  }
}

async function deleteCategory(id) {
  const db = await getDbPool();

  const [result] = await db.execute(
    "DELETE FROM category \
    WHERE id = ?",
    [id],
  );
  return result.affectedRows;
}

async function updateCategory(id, category) {
  const db = await getDbPool();

  const fields = Object.keys(category);
  const values = Object.values(category);

  const querySubstring = fields.map((field) => `${field} = ?`).join(", ");

  const [result] = await db.execute(
    `UPDATE category \
    SET ${querySubstring} \
    WHERE id = ?`,
    [...values, id],
  );
  return result.affectedRows;
}

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  deleteCategory,
  updateCategory,
};
