const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow");
const authenticateUser = require("../middleware/auth");

// Follow a user
router.post(
  "/users/:userId/follow",
  authenticateUser.authenticate,
  followController.followUser
);

// Unfollow a user
router.post(
  "/users/:userId/unfollow",
  authenticateUser.authenticate,
  followController.unfollowUser
);

// Check follow status
router.get(
  "/users/:userId/follow-status",
  authenticateUser.authenticate,
  followController.getFollowStatus
);

router.get(
  "/users/following",
  authenticateUser.authenticate,
  followController.getFollowingUsers
);

router.get(
  "/users/:userId/recipes",
  authenticateUser.authenticate,
  followController.getUserRecipes
);
module.exports = router;
