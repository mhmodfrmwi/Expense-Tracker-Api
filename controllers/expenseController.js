const statusTypes = require("../utils/statusTypes");
const Expense = require("../models/expenseModel");
const auth = require("../utils/auth");
const roles = require("../utils/roles");
const userAllow = require("../utils/userAllow");

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

const deleteExpense = (req, res) => {
  try {
  } catch (error) {}
};
const getExpense = (req, res) => {};
const getAllExpenses = (req, res) => {};
module.exports = {
  getAllExpenses,
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
};
