const Review = require("../models/review");
const User = require("../models/user");
const Recipe = require("../models/recipe");

exports.getReviews = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const reviews = await Review.findAll({
      where: { recipeId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    const newReview = await Review.create({
      rating,
      review,
      userId,
      recipeId,
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
};
