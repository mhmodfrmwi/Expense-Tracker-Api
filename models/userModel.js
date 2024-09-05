const { default: mongoose } = require("mongoose");
const roles = require("../utils/roles");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [roles.ADMIN, roles.SUPER_ADMIN, roles.USER],
    default: roles.USER,
  },
  token: { type: String },
});
module.exports = mongoose.model("User", userSchema);
