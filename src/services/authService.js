const { getDbPool } = require("../clients/db");
const apiError = require("../utils/apiError");
const authUtils = require("../utils/authUtils");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const config = require("../utils/config");

async function login(credentials, oldRefreshToken) {
  const db = await getDbPool();

  if (oldRefreshToken) {
    const payload = authUtils.verifyRefreshToken(oldRefreshToken);
    await authUtils.clearRefreshTokenRedis(payload.jti);
  }

  const [rows] = await db.execute("SELECT * FROM user WHERE username = ?", [
    credentials.username,
  ]);
  if (rows.length === 0) throw apiError(401, "User not found");
  const user = rows[0];

  if (!(await bcrypt.compare(credentials.password, user.password)))
    throw apiError(401, "Incorrect password");

  const payload = {
    jti: uuid(),
    userId: user.id,
    role: user.role,
  };
  const accessToken = authUtils.generateAccessToken(payload);
  const refreshToken = authUtils.generateRefreshToken(payload);

  await authUtils.setRefreshTokenRedis(refreshToken);

  return { access_token: accessToken, refresh_token: refreshToken };
}

async function signupCustomer(info) {
  const db = await getDbPool();

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const hashedPassword = await bcrypt.hash(
      info.password,
      config.app.saltRounds,
    );

    const [user] = await conn.execute(
      `INSERT INTO user (username, password)
      VALUES (?, ?)`,
      [info.username, hashedPassword],
    );

    const { username, password, ...infoRest } = info;

    const columns = Object.keys(infoRest).concat("user_id");
    const values = Object.values(infoRest).concat(user.insertId);

    const [customer] = await conn.execute(
      `INSERT INTO customer (${columns.join(", ")})
      VALUES (${columns.map((c) => "?").join(", ")})`,
      values,
    );

    await conn.commit();

    const payload = {
      jti: uuid(),
      userId: user.insertId,
      role: "customer",
    };

    const accessToken = authUtils.generateAccessToken(payload);
    const refreshToken = authUtils.generateRefreshToken(payload);

    await authUtils.setRefreshTokenRedis(refreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  } catch (err) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      if (err.sqlMessage.includes("user.username")) {
        throw apiError(409, "Username already exists");
      }
      if (err.sqlMessage.includes("customer.email")) {
        throw apiError(409, "Email already exists");
      }
      if (err.sqlMessage.includes("customer.mobile")) {
        throw apiError(409, "Mobile is already registered");
      }
    }
    throw apiError();
  } finally {
    conn.release();
  }
}

async function refresh(oldRefreshToken) {
  let payload;
  try {
    payload = authUtils.verifyRefreshToken(oldRefreshToken);
  } catch (err) {
    throw apiError(401, "Invalid Refresh Token");
  }

  const savedToken = await authUtils.getRefreshTokenRedis(payload.jti);

  if (savedToken !== oldRefreshToken) {
    await authUtils.clearRefreshTokenRedis(savedToken);
    throw apiError(403, "Token reuse detected");
  }

  const newPayload = {
    jti: uuid(),
    userId: payload.userId,
    role: payload.role,
  };

  const newAccessToken = authUtils.generateAccessToken(newPayload);
  const newRefreshToken = authUtils.generateRefreshToken(newPayload);

  await authUtils.clearRefreshTokenRedis(payload.jti);
  await authUtils.setRefreshTokenRedis(newRefreshToken);

  return { access_token: newAccessToken, refresh_token: newRefreshToken };
}

module.exports = { login, signup: signupCustomer, refresh };
