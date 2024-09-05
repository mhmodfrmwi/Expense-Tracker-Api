const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to db"))
  .catch((err) => {
    console.log(err);
  });
const app = express();
const expenseRoute = require("./routes/expenseRoute");
const userRoute = require("./routes/userRoute");
app.use("/users", userRoute);
app.use("/expenses", expenseRoute);
app.listen(4000);
