// routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getUserRecipes,
  editRecipe,
  deleteRecipe,
} = require("../controllers/recipe");
const authenticateUser = require("../middleware/auth");

// Route to create a new recipe
router.post("/addrecipe", authenticateUser.authenticate, createRecipe);

// Route to get all recipes
router.get("/", authenticateUser.authenticate, getRecipes);

router.get("/myrecipes", authenticateUser.authenticate, getUserRecipes);

// Route to edit a recipe
router.put("/edit/:id", authenticateUser.authenticate, editRecipe);

// Route to delete a recipe
router.delete("/delete/:id", authenticateUser.authenticate, deleteRecipe);

module.exports = router;
