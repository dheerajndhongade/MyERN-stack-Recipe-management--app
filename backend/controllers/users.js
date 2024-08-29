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
