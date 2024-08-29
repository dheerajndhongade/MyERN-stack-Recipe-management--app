const Recipe = require("../models/recipe");
const VegCollection = require("../models/vegcollection");
const NonVegCollection = require("../models/nonvegcollection");

exports.createRecipe = async (req, res) => {
  try {
    const { name, ingredients, instructions, cookingTime, servings, imageUrl } =
      req.body;

    const ingredientsString = Array.isArray(ingredients)
      ? ingredients.join(",")
      : ingredients;

    const recipe = await Recipe.create({
      name,
      ingredients: ingredientsString,
      instructions,
      cookingTime,
      servings,
      imageUrl,
      userId: req.user.id,
    });

    res.status(201).json({ message: "Recipe created successfully", recipe });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Failed to create recipe" });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    // Assuming req.user contains the authenticated user
    const userId = req.user.id;
    const recipes = await Recipe.findAll({ where: { userId } });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching user's recipes:", error);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

// Edit a recipe
exports.editRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const { name, ingredients, instructions, cookingTime, servings, imageUrl } =
    req.body;

  try {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Update the recipe details
    recipe.name = name;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    recipe.cookingTime = cookingTime;
    recipe.servings = servings;
    recipe.imageUrl = imageUrl;

    await recipe.save();

    res.status(200).json({ message: "Recipe updated successfully", recipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Failed to update recipe" });
  }
};
// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;

  try {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await recipe.destroy();

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
};

// controllers/collections.js

exports.getUserCollections = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated and `req.user` is populated

    // Fetch user's Veg collections
    const vegCollections = await VegCollection.findAll({
      where: { userId },
      include: { model: Recipe, as: "recipe" },
    });

    // Fetch user's Non-Veg collections
    const nonVegCollections = await NonVegCollection.findAll({
      where: { userId },
      include: { model: Recipe, as: "recipe" },
    });

    res.status(200).json({
      vegCollections: vegCollections.map((vc) => vc.recipe),
      nonVegCollections: nonVegCollections.map((nvc) => nvc.recipe),
    });
  } catch (error) {
    console.error("Error fetching user collections:", error);
    res.status(500).json({ message: "Failed to fetch user collections" });
  }
};
