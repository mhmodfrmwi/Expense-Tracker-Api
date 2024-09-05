const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const statusTypes = require("../utils/statusTypes");
const bcrypt = require("bcrypt");
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(409).json({
        status: statusTypes.FAIL,
        message: "This email is already in use",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" } // Consider increasing expiration time
    );

    user.token = token;

    await user.save();

    res.status(201).json({
      status: statusTypes.SUCCESS,
      message: "Registered successfully",
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: user.token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: statusTypes.FAIL,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isExist = await User.findOne({ email });
    if (!isExist) {
      return res.status(404).json({
        status: statusTypes.FAIL,
        message: "This email does not exist",
      });
    }

    const correctPassword = await bcrypt.compare(password, isExist.password);
    if (!correctPassword) {
      return res.status(401).json({
        status: statusTypes.FAIL,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { email: isExist.email, id: isExist._id, role: isExist.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    isExist.token = token;

    return res.status(200).json({
      status: statusTypes.SUCCESS,
      message: "Logged in successfully",
      data: {
        id: isExist._id,
        firstName: isExist.firstName,
        lastName: isExist.lastName,
        email: isExist.email,
        role: isExist.role,
        token: isExist.token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: statusTypes.FAIL,
      message: "Login failed",
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.body;
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      return res.status(200).json({
        status: statusTypes.SUCCESS,
        message: "Fetched Successfully",
        data: {
          id: isExist._id,
          firstName: isExist.firstName,
          lastName: isExist.lastName,
          email: isExist.email,
          role: isExist.role,
        },
      });
    } else {
      return res.status(404).json({
        status: statusTypes.FAIL,
        message: "This email does not exist",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: statusTypes.FAIL,
      message: "Error in getting data",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { __v: 0, password: 0 }); // Proper exclusion syntax

    if (!users.length) {
      return res.status(404).json({
        status: statusTypes.FAIL,
        message: "No users found",
      });
    }

    res.status(200).json({
      status: statusTypes.SUCCESS,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: statusTypes.FAIL,
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUser,
};
