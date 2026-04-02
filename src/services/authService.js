const db = require("../clients/db");
const apiError = require("../utils/apiError");
const authUtils = require("../utils/authUtils");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

async function login(credentials) {
  const [rows] = await db.execute("SELECT * FROM user WHERE username = ?", [
    credentials.username,
  ]);
  if (rows.length === 0) throw apiError(401, "User not found");
  const user = rows[0];

  if (!(await bcrypt.compare(credentials.password, user.password)))
    throw apiError(401, "Incorrect password");

  const payload = {
    jti: uuid(),
    userId: user.user_id,
    role: user.role,
  };
  const accessToken = authUtils.generateAccessToken(payload);
  const refreshToken = authUtils.generateRefreshToken(payload);

  await authUtils.setRefreshTokenRedis(payload.jti, refreshToken);

  return { accessToken, refreshToken };
}

async function signup(info) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(info.password, saltRounds);

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
      userId: user.user_id,
      role: user.role,
    };
    const accessToken = authUtils.generateAccessToken(payload);
    const refreshToken = authUtils.generateRefreshToken(payload);

    await authUtils.setRefreshTokenRedis(payload.userId, refreshToken);

    return { accessToken, refreshToken };
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
  const payload = authUtils.verifyRefreshToken(oldRefreshToken);

  const savedToken = await authUtils.getRefreshTokenRedis(payload.userId);

  if (savedToken !== oldRefreshToken) {
    throw apiError(401, "Token reuse detected");
  }

  const newPayload = {
    jti: uuid(),
    userId: payload.userId,
    role: payload.role,
  };

  const newAccessToken = authUtils.generateAccessToken(newPayload);
  const newRefreshToken = authUtils.generateRefreshToken(newPayload);

  await authUtils.setRefreshTokenRedis(newPayload.userId, newRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

module.exports = { login, signup, refresh };
