const authUtils = require("../utils/authUtils");
const apiError = require("../utils/apiError");

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (authHeader === undefined) {
    throw apiError(401, "JWT access token not provided");
  }

  const token = authHeader.split(" ")[1];

  if (token === undefined) {
    throw apiError(401, "JWT access token not provided");
  }

  try {
    const decodedPayload = authUtils.verifyAccessToken(token);
    req.user = decodedPayload;
    next();
  } catch (err) {
    throw apiError(401, "Invalid access token");
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
}

module.exports = { authenticate, authorize };
