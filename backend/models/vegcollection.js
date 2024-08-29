// models/vegcollection.js
const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const Recipe = require("./recipe");
const User = require("./user"); // Assuming you have a User model

const VegCollection = sequelize.define("VegCollection", {
  // Attributes for the VegCollection
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // Ensure this matches the table name for your User model
      key: "id",
    },
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Recipes", // Ensure this matches the table name for your Recipe model
      key: "id",
    },
  },
});

// Establish associations

module.exports = VegCollection;
