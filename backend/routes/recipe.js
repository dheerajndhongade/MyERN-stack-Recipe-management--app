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
const { getReviews, addReview } = require("../controllers/reviews");
const authenticateUser = require("../middleware/auth");

router.post("/addrecipe", authenticateUser.authenticate, createRecipe);

router.get("/", authenticateUser.authenticate, getRecipes);

router.get("/myrecipes", authenticateUser.authenticate, getUserRecipes);

router.put("/edit/:id", authenticateUser.authenticate, editRecipe);

router.delete("/delete/:id", authenticateUser.authenticate, deleteRecipe);

router.get("/:recipeId/reviews", authenticateUser.authenticate, getReviews);

router.post("/:recipeId/reviews", authenticateUser.authenticate, addReview);

module.exports = router;
