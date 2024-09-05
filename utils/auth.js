const jwt = require("jsonwebtoken");
const auth = (authorization) => {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "fail",
      message: "Authorization token is missing or invalid",
    });
  }
  const token = authorization.split(" ")[1];

  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
module.exports = auth;
