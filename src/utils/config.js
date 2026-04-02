require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
  quiet: true,
});

const db = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
};

const app = {
  port: process.env.PORT,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  saltRounds: 10,
};

const env = process.env.NODE_ENV;

module.exports = { db, app, env };
