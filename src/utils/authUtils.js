const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const { getRedisClient } = require("../clients/redis");

const redisClient = getRedisClient();

const accessSecret = config.app.jwt_access_secret;
const refreshSecret = config.app.jwt_refresh_secret;

function generateAccessToken(payload) {
  return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
}

function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret);
}

async function setRefreshTokenRedis(refreshToken) {
  const payload = verifyRefreshToken(refreshToken);

  return await redisClient.set(`refresh:${payload.jti}`, refreshToken, {
    EX: 7 * 24 * 60 * 60,
  });
}

async function getRefreshTokenRedis(jti) {
  return await redisClient.get(`refresh:${jti}`);
}

async function clearRefreshTokenRedis(jti) {
  return await redisClient.del(`refresh:${jti}`);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setRefreshTokenRedis,
  getRefreshTokenRedis,
  clearRefreshTokenRedis,
};
