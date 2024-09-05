const jwt = require("jsonwebtoken");
const auth = require("../utils/auth");

const allowedTo = (...roles) => {
  return (req, res, next) => {
    try {
      const authorization = req.headers["authorization"];
      const decoded = auth(authorization);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          status: "fail",
          message: "You are not allowed to perform this action",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid or expired token",
        error: error.message,
      });
    }
  };
};

module.exports = allowedTo;
