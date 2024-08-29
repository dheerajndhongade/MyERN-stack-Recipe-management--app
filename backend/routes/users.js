let express = require("express");
let router = express.Router();
let userController = require("../controllers/users");
let authenticate = require("../middleware/auth");

router.post("/user/signup", userController.createUser);

router.post("/user/login", userController.loginUser);

module.exports = router;
