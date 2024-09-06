const roles = require("./roles");
const statusTypes = require("./statusTypes");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const expenseModel = require("../models/expenseModel");
const userAllow = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;
    const authorization = req.headers["authorization"];

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.status(401).json({
        status: statusTypes.FAIL,
        message: "Authorization token is missing or invalid",
      });
      return false;
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id: userId, role: userRole } = decoded;

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      res.status(400).json({
        status: statusTypes.FAIL,
        message: "Invalid expense ID format",
      });
      return false;
    }

    const expense = await expenseModel.findById(expenseId);
    if (!expense) {
      res.status(404).json({
        status: statusTypes.FAIL,
        message: "Expense not found",
      });
      return false;
    }

    const allowedRoles = [roles.ADMIN, roles.SUPER_ADMIN];
    if (
      expense.userId.toString() !== userId &&
      !allowedRoles.includes(userRole)
    ) {
      res.status(403).json({
        status: statusTypes.FAIL,
        message: "You do not have any control on this expense",
      });
      return false;
    }

    return true;
  } catch (error) {
    res.status(500).json({
      status: statusTypes.ERROR,
      message: "Authorization error",
      error: error.message,
    });
    return false;
  }
};
module.exports = userAllow;
