const express = require("express");
const router = express.Router();
const verifyFirebaseToken = require("../middleware/firebaseMiddleware");

router.post("/verifyFirebaseToken", verifyFirebaseToken);

module.exports = router;
