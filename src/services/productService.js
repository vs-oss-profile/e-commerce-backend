const db = require("../clients/db");
const apiError = require("../utils/apiError");
const fs = require("fs").promises;
const path = require("path");
const logger = require("../utils/logger");

const NUM_NEW_PRODUCTS = 3;

async function getAllProducts(category_id) {
  let rows;
  if (category_id !== undefined) {
    [rows] = await db.execute(
      `SELECT
        product.id AS id,
        product.name AS name,
        product.description AS description,
        product.price AS price,
        product.quantity AS quantity,
        product.image AS image,
        offer.offer_price AS offer_price,
        (CASE
        	WHEN ROW_NUMBER() OVER (ORDER BY product.created_at DESC) <= ${NUM_NEW_PRODUCTS}
            THEN TRUE
            ELSE FALSE
        END) AS is_new
      FROM product
      LEFT JOIN offer
      ON product.id = offer.product_id
      WHERE product.category_id = ?`,
      [category_id],
    );
  } else {
    [rows] = await db.execute(
      `SELECT
        product.id AS id,
        product.name AS name,
        product.description AS description,
        product.price AS price,
        product.quantity AS quantity,
        product.image AS image,
        offer.offer_price AS offer_price,
        (CASE
        	WHEN ROW_NUMBER() OVER (ORDER BY product.created_at DESC) <= ${NUM_NEW_PRODUCTS}
            THEN TRUE
            ELSE FALSE
        END) AS is_new
      FROM product
      LEFT JOIN offer
      ON product.id = offer.product_id`,
    );
  }
  return rows;
}

async function getNewProducts(category_id) {
  let rows;
  if (category_id !== undefined) {
    [rows] = await db.execute(
      `SELECT
        product.id AS id,
        product.name AS name,
        product.description AS description,
        product.price AS price,
        product.quantity AS quantity,
        product.image AS image,
        offer.offer_price AS offer_price,
        (CASE
        	WHEN ROW_NUMBER() OVER (ORDER BY product.created_at DESC) <= ${NUM_NEW_PRODUCTS}
            THEN TRUE
            ELSE FALSE
        END) AS is_new
      FROM product
      LEFT JOIN offer
      ON product.id = offer.product_id
      WHERE category_id = ?
      ORDER BY product.created_at DESC
      LIMIT 6`,
      [category_id],
    );
  } else {
    [rows] = await db.execute(
      `SELECT
        product.id AS id,
        product.name AS name,
        product.description AS description,
        product.price AS price,
        product.quantity AS quantity,
        product.image AS image,
        offer.offer_price AS offer_price,
        (CASE
        	WHEN ROW_NUMBER() OVER (ORDER BY product.created_at DESC) <= ${NUM_NEW_PRODUCTS}
            THEN TRUE
            ELSE FALSE
        END) AS is_new
      FROM product
      LEFT JOIN offer
      ON product.id = offer.product_id
      ORDER BY product.created_at DESC
      LIMIT 6`,
    );
  }
  return rows;
}

async function getFeaturedProducts(category_id) {
  let rows;
  if (category_id !== undefined) {
    [rows] = await db.execute(
      `SELECT
        product.id AS id,
        product.name AS name,
        product.description AS description,
        product.price AS price,
        product.quantity AS quantity,
        product.image AS image,
        offer.offer_price AS offer_price,
        (CASE
        	WHEN ROW_NUMBER() OVER (ORDER BY product.created_at DESC) <= ${NUM_NEW_PRODUCTS}
            THEN TRUE
            ELSE FALSE
        END) AS is_new
      FROM product
      LEFT JOIN offer
      ON product.id = offer.product_id
      WHERE product.category_id = ?
      LIMIT 3`,
      [category_id],
    );
  } else {
    [rows] = await db.execute(
      `SELECT
        product.id AS id,
        product.name AS name,
        product.description AS description,
        product.price AS price,
        product.quantity AS quantity,
        product.image AS image,
        offer.offer_price AS offer_price,
        (CASE
        	WHEN ROW_NUMBER() OVER (ORDER BY product.created_at DESC) <= ${NUM_NEW_PRODUCTS}
            THEN TRUE
            ELSE FALSE
        END) AS is_new
      FROM product
      LEFT JOIN offer
      ON product.id = offer.product_id
      LIMIT 3`,
    );
  }
  return rows;
}

async function getBestSellingProducts(category_id) {
  let rows;
  if (category_id !== undefined) {
    [rows] = await db.execute(
      `SELECT
        product.id AS id,
        product.name AS name,
        product.description AS description,
        product.price AS price,
        product.quantity AS quantity,
        product.image AS image,
        offer.offer_price AS offer_price,
        (CASE
        	WHEN ROW_NUMBER() OVER (ORDER BY product.created_at DESC) <= ${NUM_NEW_PRODUCTS}
            THEN TRUE
            ELSE FALSE
        END) AS is_new
      FROM product
      LEFT JOIN offer
      ON product.id = offer.product_id
      WHERE product.category_id = ?
      ORDER BY quantity DESC
      LIMIT 6`,
      [category_id],
    );
  } else {
    [rows] = await db.execute(
      `SELECT
        product.id AS id,
        product.name AS name,
        product.description AS description,
        product.price AS price,
        product.quantity AS quantity,
        product.image AS image,
        offer.offer_price AS offer_price,
        (CASE
        	WHEN ROW_NUMBER() OVER (ORDER BY product.created_at DESC) <= ${NUM_NEW_PRODUCTS}
            THEN TRUE
            ELSE FALSE
        END) AS is_new
      FROM product
      LEFT JOIN offer
      ON product.id = offer.product_id
      ORDER BY quantity DESC
      LIMIT 6`,
    );
  }
  return rows;
}

async function getProductsWithBestDeals(category_id) {
  let rows;

  if (category_id !== undefined) {
    [rows] = await db.execute(
      `WITH ranked AS
        (SELECT
          p.id AS id,
          p.name AS name,
          p.description AS description,
          p.category_id AS category_id,
          p.price AS price,
          p.quantity AS quantity,
          o.offer_price AS offer_price,
          ROW_NUMBER() OVER
            (PARTITION BY p.category_id
            ORDER BY ((p.price - o.offer_price)/NULLIF(p.price, 0)) DESC)
          AS discount_rank,
          (CASE
            WHEN ROW_NUMBER() OVER (ORDER BY p.created_at DESC) <= ${NUM_NEW_PRODUCTS}
              THEN TRUE
              ELSE FALSE
          END) AS is_new
        FROM product p
        JOIN offer o
        ON p.id = o.product_id)
      SELECT *
      FROM ranked
      WHERE ranked.discount_rank <= 6 AND ranked.category_id = ?`,
      [category_id],
    );
  } else {
    [rows] = await db.execute(
      `WITH ranked AS
        (SELECT
          p.id AS id,
          p.name AS name,
          p.description AS description,
          p.category_id AS category_id,
          p.price AS price,
          p.quantity AS quantity,
          o.offer_price AS offer_price,
          ROW_NUMBER() OVER
            (ORDER BY ((p.price - o.offer_price)/NULLIF(p.price, 0)) DESC)
          AS discount_rank,
          (CASE
            WHEN ROW_NUMBER() OVER (ORDER BY p.created_at DESC) <= ${NUM_NEW_PRODUCTS}
              THEN TRUE
              ELSE FALSE
          END) AS is_new
        FROM product p
        JOIN offer o
        ON p.id = o.product_id)
      SELECT *
      FROM ranked
      WHERE ranked.discount_rank <= 6`,
    );
  }
  return rows;
}

async function getProductById(id) {
  const [rows] = await db.execute(
    `SELECT
      product.id AS id,
      product.name AS name,
      price,
      quantity,
      product.image AS image,
      rating_avg,
      rating_count,
      product.category_id AS category_id,
      category.name AS category,
      category.description AS category_description,
      offer.offer_price AS offer_price
    FROM product
    JOIN category
    ON product.category_id = category.id
    LEFT JOIN offer
    ON product.id = offer.product_id
    WHERE product.id = ?`,
    [id],
  );
  return rows;
}

async function addProduct(product, image) {
  const columns = Object.keys(product).concat("image");
  const values = Object.values(product).concat(image.filename);

  try {
    const [result] = await db.execute(
      `INSERT INTO product (${columns.join(", ")})
      VALUES (${columns.map((c) => "?").join(", ")})`,
      values,
    );
    return { id: result.insertId };
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      throw apiError(400, "Invalid category_id. Referenced category not found");
    }
    throw err;
  }
}

async function deleteProductImage(product_id) {
  const [rows] = await db.execute(
    "SELECT image FROM product WHERE product_id = ?",
    [product_id],
  );

  try {
    const imagePath = path.join(__dirname, "../../uploads", rows[0].image);
    await fs.unlink(imagePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw apiError(500, "Server error while deleting the image");
    }
  }
}

async function deleteProduct(id) {
  await deleteProductImage(id);
  const [result] = await db.execute(
    "DELETE FROM product WHERE product_id = ?",
    [id],
  );
  return result.affectedRows;
}

async function updateProduct(id, product, image) {
  let columns = Object.keys(product);
  let values = Object.values(product);

  if (image !== undefined) {
    columns = columns.concat("image");
    values = values.concat(image.filename);
    deleteProductImage(id);
  }

  const querySubstring = columns.map((column) => `${column} = ?`).join(", ");

  try {
    const [result] = await db.execute(
      `UPDATE product
      SET ${querySubstring}
      WHERE product_id = ?`,
      [...values, id],
    );
    return result.affectedRows;
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      throw apiError(400, "Invalid category_id. Referenced category not found");
    }
    throw err;
  }
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
