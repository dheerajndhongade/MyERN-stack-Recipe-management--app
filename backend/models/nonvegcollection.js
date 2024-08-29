// models/nonvegcollection.js
const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const Recipe = require("./recipe");
const User = require("./user"); // Assuming you have a User model

const NonVegCollection = sequelize.define(
  "NonVegCollection",
  {
    // Attributes for the NonVegCollection
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
  },
  {
    timestamps: true, // Includes createdAt and updatedAt fields
  }
);

// Establish associations

module.exports = NonVegCollection;
