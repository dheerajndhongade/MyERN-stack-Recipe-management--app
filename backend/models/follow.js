const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Follow = sequelize.define("Follow", {
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
});

module.exports = Follow;
