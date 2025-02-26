const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const firebaseMiddleware = require("../middleware/firebaseMiddleware");

router.put(
  "/update/user/detail/api/:id",
  firebaseMiddleware,
  userController.updateUser
);
router.get("/get/user/api/", firebaseMiddleware, userController.listUserId);
router.get(
  "/get/check/user/profile/api/:id",
  firebaseMiddleware,
  userController.checkUserProfile
);
module.exports = router;
