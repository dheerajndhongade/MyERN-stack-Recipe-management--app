const User = require("../models/user");
const Follow = require("../models/follow");

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
