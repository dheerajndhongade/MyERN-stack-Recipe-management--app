const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

let jwtSecretKey = process.env.JWT_SECRET;
exports.createUser = (req, res) => {
  console.log(req.body);
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let phno = req.body.phno;

  User.findOne({ where: { email } })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      return User.create({
        name: name,
        email: email,
        phno: phno,
        password: hashedPassword,
      });
    })
    .then(() => {
      console.log("User created");
      res.status(201).json({
        message: "User created successfully",
      });
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      res
        .status(500)
        .json({ message: "An error occurred while creating the user" });
    });
};
exports.loginUser = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
      }
      return bcrypt.compare(password, user.password).then((isValidPassword) => {
        if (!isValidPassword) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        let token = jwt.sign({ userId: user.id }, jwtSecretKey);
        res.status(200).json({
          token,
          username: user.username,
          message: "Login successful",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error during login" });
    });
};

exports.fetchAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll({
      attributes: ["id", "name", "email", "isAdmin"], // Include only necessary fields
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getAdminStatus = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is available in req.user from authentication middleware
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/userController.js

// Fetch user's profile details
exports.getUserProfile = async (req, res) => {
  console.log(req.user);
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "isAdmin"], // Include only necessary fields
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// Update user's profile details
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body; // Only allow name and email to be updated
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
