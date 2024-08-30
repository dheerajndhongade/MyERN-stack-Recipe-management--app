// controllers/adminController.js
const User = require("../models/user");
const Recipe = require("../models/recipe");

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID of the user to be deleted
    const loggedInUserId = req.user.id; // Get the ID of the logged-in user (from authentication middleware)

    // Prevent self-deletion
    if (parseInt(id) === loggedInUserId) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    }

    // Find the user to be deleted
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Proceed with deletion
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

// Delete recipe by ID
exports.deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    await Recipe.destroy({ where: { id: recipeId } });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
