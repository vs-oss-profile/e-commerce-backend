const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  logger.error(err);

  res.status(status).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
