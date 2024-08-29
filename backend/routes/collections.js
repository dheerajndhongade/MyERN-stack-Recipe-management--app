// routes/collectionRoutes.js
const express = require("express");
const router = express.Router();
const {
  addToVegCollection,
  addToNonVegCollection,
  getVegCollection,
  getNonVegCollection,
} = require("../controllers/collections");

const authenticateUser = require("../middleware/auth");

// Add a recipe to Veg collection
router.post("/veg", authenticateUser.authenticate, addToVegCollection);

// Add a recipe to Non-Veg collection
router.post("/nonveg", authenticateUser.authenticate, addToNonVegCollection);

router.get("/veg", authenticateUser.authenticate, getVegCollection);

// Fetch Non-Veg collection for the authenticated user
router.get("/nonveg", authenticateUser.authenticate, getNonVegCollection);

// Get user's collections

module.exports = router;
