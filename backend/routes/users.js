let express = require("express");
let router = express.Router();
let userController = require("../controllers/users");
let authenticate = require("../middleware/auth");

router.get(
  "/users/admin-status",
  authenticate.authenticate,
  userController.getAdminStatus
);

router.post("/user/signup", userController.createUser);

router.post("/user/login", userController.loginUser);

router.get("/users", userController.fetchAllUsers);

router.get(
  "/users/profile",
  authenticate.authenticate,
  userController.getUserProfile
);

// Route to update user profile
router.put(
  "/users/profile",
  authenticate.authenticate,
  userController.updateUserProfile
);

module.exports = router;
