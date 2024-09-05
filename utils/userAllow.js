const jwt = require("jsonwebtoken");
const expenseModel = require("../models/expenseModel");
const roles = require("./roles");
const statusTypes = require("./statusTypes");

const userAllow = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const authorization = req.headers["authorization"];

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        status: statusTypes.FAIL,
        message: "Authorization token is missing or invalid",
      });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id: userId, role: userRole } = decoded;

    const expense = await expenseModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({
        status: statusTypes.FAIL,
        message: "Expense not found",
      });
    }

    const allowedRoles = [roles.ADMIN, roles.SUPER_ADMIN];
    if (
      expense.userId.toString() !== userId &&
      !allowedRoles.includes(userRole)
    ) {
      return res.status(403).json({
        status: statusTypes.FAIL,
        message: "You are not allowed to update this expense",
      });
    }

    // Return true if allowed
    return true;
  } catch (error) {
    return res.status(500).json({
      status: statusTypes.ERROR,
      message: "Authorization error",
      error: error.message,
    });
  }
};
module.exports = userAllow;
