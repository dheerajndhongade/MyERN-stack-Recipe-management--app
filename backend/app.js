const express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let port = 5000;

let sequelize = require("./util/database");
let userRoute = require("./routes/users");
let recipeRoute = require("./routes/recipe");
let collectionRoute = require("./routes/collections");

let User = require("./models/user");
let Recipe = require("./models/recipe");
let VegCollection = require("./models/vegcollection");
let NonVegCollection = require("./models/nonvegcollection");

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(userRoute);
app.use("/recipes", recipeRoute);
app.use("/collections", collectionRoute);

User.hasMany(Recipe, { foreignKey: "userId", as: "recipes" });
Recipe.belongsTo(User, { foreignKey: "userId", as: "user" });

VegCollection.belongsTo(User, { foreignKey: "userId", as: "user" });
VegCollection.belongsTo(Recipe, { foreignKey: "recipeId", as: "recipe" });

NonVegCollection.belongsTo(User, { foreignKey: "userId", as: "user" });
NonVegCollection.belongsTo(Recipe, { foreignKey: "recipeId", as: "recipe" });

sequelize
  .sync()
  //.sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Running at port ${port}`);
    });
  })
  .catch((err) => console.log(err));
