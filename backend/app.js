const express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let port = 5000;

let sequelize = require("./util/database");
let userRoute = require("./routes/users");
let recipeRoute = require("./routes/recipe");
let collectionRoute = require("./routes/collections");
let followRoute = require("./routes/follow");
let adminRoute = require("./routes/admin");

let User = require("./models/user");
let Recipe = require("./models/recipe");
let VegCollection = require("./models/vegcollection");
let NonVegCollection = require("./models/nonvegcollection");
let Review = require("./models/review");
let Follow = require("./models/follow");

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(userRoute);
app.use("/recipes", recipeRoute);
app.use(followRoute);
app.use("/collections", collectionRoute);
app.use("/admin", adminRoute);

User.hasMany(Recipe, { foreignKey: "userId", as: "recipes" });
Recipe.belongsTo(User, { foreignKey: "userId", as: "user" });

VegCollection.belongsTo(User, { foreignKey: "userId", as: "user" });
VegCollection.belongsTo(Recipe, { foreignKey: "recipeId", as: "recipe" });

NonVegCollection.belongsTo(User, { foreignKey: "userId", as: "user" });
NonVegCollection.belongsTo(Recipe, { foreignKey: "recipeId", as: "recipe" });

// Define associations for reviews
User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

Recipe.hasMany(Review, { foreignKey: "recipeId", as: "reviews" });
Review.belongsTo(Recipe, { foreignKey: "recipeId", as: "recipe" });

User.belongsToMany(User, {
  as: "Followers",
  through: Follow,
  foreignKey: "followingId",
});
User.belongsToMany(User, {
  as: "Following",
  through: Follow,
  foreignKey: "followerId",
});

sequelize
  .sync()
  //.sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Running at port ${port}`);
    });
  })
  .catch((err) => console.log(err));
