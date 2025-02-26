const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const firebaseMiddleware = require("../middleware/firebaseMiddleware");

router.post(
  "/create/payment/api/",
  firebaseMiddleware,
  paymentController.createPayment
);
router.post(
  "/get/confirm/payment/api/",
  firebaseMiddleware,
  paymentController.confirmPayment
);

module.exports = router;
