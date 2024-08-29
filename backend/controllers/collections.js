// controllers/vegCollection.js
const VegCollection = require("../models/vegcollection");
const Recipe = require("../models/recipe");
const NonVegCollection = require("../models/nonvegcollection");

exports.addToVegCollection = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and `req.user` is populated

    // Check if recipe exists
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the recipe is already in the user's collection
    const existingCollection = await VegCollection.findOne({
      where: { recipeId, userId },
    });
    if (existingCollection) {
      return res.status(400).json({ message: "Recipe already in collection" });
    }

    // Add recipe to veg collection
    await VegCollection.create({ recipeId, userId });
    res.status(201).json({ message: "Recipe added to Veg collection" });
  } catch (error) {
    console.error("Error adding to Veg collection:", error);
    res.status(500).json({ message: "Failed to add recipe to Veg collection" });
  }
};

// controllers/nonVegCollection.js

exports.addToNonVegCollection = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and `req.user` is populated

    // Check if recipe exists
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if the recipe is already in the user's collection
    const existingCollection = await NonVegCollection.findOne({
      where: { recipeId, userId },
    });
    if (existingCollection) {
      return res.status(400).json({ message: "Recipe already in collection" });
    }

    // Add recipe to non-veg collection
    await NonVegCollection.create({ recipeId, userId });
    res.status(201).json({ message: "Recipe added to Non-Veg collection" });
  } catch (error) {
    console.error("Error adding to Non-Veg collection:", error);
    res
      .status(500)
      .json({ message: "Failed to add recipe to Non-Veg collection" });
  }
};

// controllers/collections.js

exports.getVegCollection = async (req, res) => {
  try {
    const userId = req.user.id;

    const vegCollections = await VegCollection.findAll({
      where: { userId },
      include: {
        model: Recipe,
        as: "recipe", // This should match the alias used in associations
        attributes: [
          "id",
          "name",
          "ingredients",
          "instructions",
          "cookingTime",
          "servings",
          "imageUrl",
        ],
      },
    });

    res.status(200).json(vegCollections);
  } catch (error) {
    console.error("Error fetching Veg collections:", error);
    res.status(500).json({ message: "Failed to fetch Veg collections" });
  }
};

exports.getNonVegCollection = async (req, res) => {
  try {
    const userId = req.user.id;

    const nonVegCollections = await NonVegCollection.findAll({
      where: { userId },
      include: {
        model: Recipe,
        as: "recipe", // This should match the alias used in associations
        attributes: [
          "id",
          "name",
          "ingredients",
          "instructions",
          "cookingTime",
          "servings",
          "imageUrl",
        ],
      },
    });

    res.status(200).json(nonVegCollections);
  } catch (error) {
    console.error("Error fetching Non-Veg collections:", error);
    res.status(500).json({ message: "Failed to fetch Non-Veg collections" });
  }
};
