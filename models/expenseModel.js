const { default: mongoose } = require("mongoose");

const expenseSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      "Groceries",
      "Leisure",
      "Electronics",
      "Utilities",
      "Clothing",
      "Health",
      "Others",
    ],
  },
  amount: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
  userId: {
    type: String,
  },
});
module.exports = mongoose.model("Expense", expenseSchema);
