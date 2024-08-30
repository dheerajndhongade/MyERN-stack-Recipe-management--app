// routes/admin.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const authenticate = require("../middleware/auth");
const authorizeAdmin = require("../middleware/authAdmin"); // Middleware to check if the user is an admin

// Route to delete a user
router.delete(
  "/users/:userId",
  authenticate.authenticate,
  authorizeAdmin,
  adminController.deleteUser
);

// Route to delete a recipe
router.delete(
  "/recipes/:recipeId",
  authenticate.authenticate,
  authorizeAdmin,
  adminController.deleteRecipe
);

module.exports = router;
