const db = require("../clients/db");
const apiError = require("../utils/apiError");

async function getAllOffers(category_id) {
  let rows;
  if (category_id !== undefined) {
    [rows] = await db.execute(
      `SELECT offer.id AS id, product.id AS product_id, product.name AS product, product.price AS price, offer_price, valid_till
      FROM offer
      JOIN product
      ON offer.product_id = product.id
      WHERE product.category_id = ?`,
      [category_id],
    );
  } else {
    [rows] = await db.execute(
      `SELECT offer.id AS id, product.id AS product_id, product.name AS product, product.price as price, offer_price, valid_till
      FROM offer
      JOIN product
      ON offer.product_id = product.id`,
    );
  }
  return rows;
}

async function getOfferById(id) {
  const [rows] = await db.execute(
    `SELECT offer.id AS id, product.id AS product_id, product.name AS product, product.price AS price, offer_price, valid_till
    FROM offer
    JOIN product
    ON offer.product_id = product.id
    WHERE offer.id = ?`,
    [id],
  );
  return rows;
}

const getTimestampString = (isoString) => {
  // get string for mySQL timestamp
  const date = isoString.split("T")[0];
  const time = isoString.split("T")[1].split("Z")[0];
  return date + " " + time;
};

async function addOffer(offer) {
  const valid_till = getTimestampString(offer.valid_till);

  offer = {
    ...offer,
    valid_till,
  };

  const columns = Object.keys(offer);
  const values = Object.values(offer);

  const [existingOffers] = await db.execute(
    `SELECT * FROM offer WHERE product_id = ?`,
    [offer.product_id],
  );

  if (existingOffers.length > 0) {
    throw apiError(409, "An offer already exists for this product");
  }

  const [products] = await db.execute(`SELECT * FROM product WHERE id = ?`, [
    offer.product_id,
  ]);

  if (products[0].price < offer.offer_price) {
    throw apiError(400, "Offer price must be less than MRP");
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO offer (${columns.join(", ")})
      VALUES (${columns.map((c) => "?").join(", ")})`,
      values,
    );
    return { id: result.insertId };
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      throw apiError(400, "Invalid product_id. Referenced product not found");
    }
    throw err;
  }
}

async function deleteOffer(id) {
  const [result] = await db.execute(`DELETE FROM offer WHERE id = ?`, [id]);
  return result.affectedRows;
}

async function updateOffer(id, offer) {
  const columns = Object.keys(offer);
  const values = Object.values(offer);
  const querySubString = columns.map((c) => `${c} = ?`).join(", ");

  const [result] = await db.execute(
    `UPDATE offer
    SET ${querySubString}
    WHERE id = ?`,
    [...values, id],
  );
  return result.affectedRows;
}

module.exports = {
  getAllOffers,
  getOfferById,
  addOffer,
  deleteOffer,
  updateOffer,
};
