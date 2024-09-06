const statusTypes = require("../utils/statusTypes");
const Expense = require("../models/expenseModel");
const auth = require("../utils/auth");
const userAllow = require("../utils/userAllow");
const jwt = require("jsonwebtoken");
const addExpense = async (req, res) => {
  try {
    const { category, amount } = req.body;

    if (!category || !amount) {
      return res.status(400).json({
        status: statusTypes.FAIL,
        message: "Category and amount are required",
      });
    }

    const authorization = req.headers["authorization"];
    const decoded = auth(authorization);

    const expense = new Expense({
      category,
      amount,
      userId: decoded.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await expense.save();

    res.status(201).json({
      status: statusTypes.SUCCESS,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      status: statusTypes.ERROR,
      message: "Error adding expense",
      error: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const isAllowed = await userAllow(req, res);
    if (!isAllowed) return;

    const expenseId = req.params.expenseId;
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      status: statusTypes.SUCCESS,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    return res.status(500).json({
      status: statusTypes.ERROR,
      message: "Error updating expense",
      error: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const isAllowed = await userAllow(req, res);
    if (!isAllowed) return;

    const expenseId = req.params.expenseId;

    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) {
      return res.status(404).json({
        status: statusTypes.ERROR,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      status: statusTypes.SUCCESS,
      message: "Expense deleted successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      status: statusTypes.ERROR,
      message: "Error deleting expense",
      error: error.message,
    });
  }
};

const getExpense = async (req, res) => {
  try {
    const isAllowed = await userAllow(req, res);
    if (!isAllowed) return;

    const expenseId = req.params.expenseId;
    const expense = await Expense.findOne({ _id: expenseId });

    if (!expense) {
      return res.status(404).json({
        status: statusTypes.FAIL,
        message: "Expense not found",
      });
    }
    res.status(200).json({
      status: statusTypes.SUCCESS,
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      status: statusTypes.ERROR,
      message: "Error getting expense",
      error: error.message,
    });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return res.status(401).json({
        status: statusTypes.ERROR,
        message: "Authorization header missing",
      });
    }

    const token = authorization.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({
        status: statusTypes.ERROR,
        message: "Invalid or expired token",
      });
    }

    const id = decoded.id;

    const { timeFilter, start, end } = req.query;

    let filter = { userId: id };

    const currentDate = new Date();
    let startDate, endDate;

    if (timeFilter === "pastWeek") {
      startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
    } else if (timeFilter === "pastMonth") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    } else if (timeFilter === "last3Months") {
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
    } else if (start && end) {
      // Custom date range
      startDate = new Date(start);
      endDate = new Date(end);
    }

    if (startDate) {
      filter.createdAt = { $gte: startDate };
    }
    if (endDate) {
      filter.createdAt = { $lte: endDate };
    }

    const expenses = await Expense.find(filter).select("-__v -userId");

    res.status(200).json({
      status: statusTypes.SUCCESS,
      data: expenses,
    });
  } catch (error) {
    return res.status(500).json({
      status: statusTypes.ERROR,
      message: "Error getting expenses",
      error: error.message,
    });
  }
};

module.exports = {
  getAllExpenses,
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
};
