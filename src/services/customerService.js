const db = require("../clients/db");
const apiError = require("../utils/apiError");

async function getAllCustomers() {
  const [rows] = await db.execute("SELECT * FROM customer");
  return rows;
}

async function getCustomerById(id) {
  const [rows] = await db.execute("SELECT * FROM customer WHERE id = ?", [id]);
  return rows;
}

async function addCustomer(customer) {
  const columns = Object.keys(customer);
  const values = Object.values(customer);

  try {
    const [result] = await db.execute(
      `INSERT INTO customer (${columns.join(", ")}) \
      VALUES (${columns.map((c) => "?").join(", ")})`,
      values,
    );
    return { id: result.insertId };
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      throw apiError(400, "Invalid user_id. Referenced user not found");
    }
    throw err;
  }
}

async function deleteCustomer(id) {
  const [rows] = await db.execute(`SELECT * FROM customer WHERE id = ?`, [id]);
  if (rows.length === 0) return 0;

  const customer = rows[0];

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [resultCustomer] = await conn.execute(
      `DELETE FROM customer WHERE id = ?`,
      [id],
    );

    const [resultUser] = await conn.execute(
      `DELETE FROM user
      WHERE id = ?`,
      [customer.user_id],
    );

    await conn.commit();

    if (resultCustomer.affectedRows === 0 || resultUser.affectedRows === 0) {
      throw apiError(404, "Customer information not found");
    }

    return resultUser.affectedRows;
  } catch (err) {
    await conn.rollback();
    throw apiError();
  } finally {
    conn.release();
  }
}

async function updateCustomer(id, customer) {
  const fields = Object.keys(customer);
  const values = Object.values(customer);
  const querySubstring = fields.map((field) => `${field} = ?`).join(", ");

  const [result] = await db.execute(
    `UPDATE customer
    SET ${querySubstring}
    WHERE id = ?`,
    [...values, id],
  );

  return result.affectedRows;
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  // addCustomer,
  deleteCustomer,
  updateCustomer,
};
