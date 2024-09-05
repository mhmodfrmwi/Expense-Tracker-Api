const express = require("express");

const route = express.Router();
route.use(express.json());
const userController = require("../controllers/userController");
const roles = require("../utils/roles");
const allowedTo = require("../middlewares/allowedTo");
route.post("/register", userController.register);
route.post("/login", userController.login);
route.get(
  "/getAllUsers",
  allowedTo(roles.SUPER_ADMIN, roles.ADMIN),
  userController.getAllUsers
);
route.get(
  "/getUser",
  allowedTo(roles.SUPER_ADMIN, roles.ADMIN),
  userController.getUser
);
module.exports = route;
