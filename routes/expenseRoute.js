const express = require("express");

const route = express.Router();
const expenseController = require("../controllers/expenseController");
route.use(express.json());
route.post("/", expenseController.addExpense);
route.put("/:expenseId", expenseController.updateExpense);
route.delete("/:expenseId", expenseController.deleteExpense);
route.get("/:expenseId", expenseController.getExpense);
route.get("/", expenseController.getAllExpenses);

module.exports = route;
