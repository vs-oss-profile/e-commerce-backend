const db = require("../clients/db");

async function getAllCategories() {
  const [rows] = await db.execute("SELECT * FROM category");
  return rows;
}

async function getCategoryById(id) {
  const [rows] = await db.execute("SELECT * FROM category WHERE id = ?", [id]);
  return rows;
}

async function addCategory(name, description) {
  const [result] = await db.execute(
    "INSERT INTO category (name, description) \
    VALUES (?, ?)",
    [name, description],
  );
  return { id: result.insertId };
}

async function deleteCategory(id) {
  const [result] = await db.execute(
    "DELETE FROM category \
    WHERE id = ?",
    [id],
  );
  return result.affectedRows;
}

async function updateCategory(id, category) {
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
