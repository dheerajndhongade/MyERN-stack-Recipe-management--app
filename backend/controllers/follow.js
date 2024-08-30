const User = require("../models/user");
const Follow = require("../models/follow");
const Recipe = require("../models/recipe");

exports.followUser = async (req, res) => {
  try {
    console.log("aaaaaaaaaa");
    const followerId = req.user.id; // Assuming req.user is populated by authentication middleware
    const followingId = parseInt(req.params.userId, 10);
    console.log(followerId, followerId);

    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      return res.status(400).json({ message: "Already following this user" });
    }

    await Follow.create({ followerId, followingId });
    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.userId, 10);

    const follow = await Follow.findOne({
      where: { followerId, followingId },
    });

    if (!follow) {
      return res.status(404).json({ message: "Not following this user" });
    }

    await follow.destroy();
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const checkUserId = parseInt(req.params.userId, 10);

    const following = await Follow.findOne({
      where: { followerId: userId, followingId: checkUserId },
    });

    res.status(200).json({ isFollowing: !!following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowingUsers = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is set by authentication middleware

    // Fetch users that the current user is following
    const user = await User.findByPk(userId, {
      include: {
        model: User,
        as: "Following",
        attributes: ["id", "name"], // Only fetch necessary attributes
        through: { attributes: [] }, // Exclude join table attributes
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.Following);
  } catch (error) {
    console.error("Error fetching following users:", error);
    res.status(500).json({ error: "Failed to fetch following users" });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user to ensure they exist (optional step)
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch recipes by user ID
    const recipes = await Recipe.findAll({
      where: { userId },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "name"], // Fetch the user's basic info
      },
    });

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    res.status(500).json({ error: "Failed to fetch user recipes" });
  }
};
