const { default: mongoose } = require("mongoose");

const expenseSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
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
