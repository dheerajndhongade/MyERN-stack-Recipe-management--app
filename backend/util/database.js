let Sequelize = require("sequelize");

let sequelize = new Sequelize("recepie-management", "root", "12@Dheeraj", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
