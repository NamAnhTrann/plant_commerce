const express = require("express");
const router = express.Router();
const orderItemController = require("../controller/orderItemController");
const firebaseMiddleware = require("../middleware/firebaseMiddleware");

router.post(
  "/create/order/api/",
  firebaseMiddleware,
  orderItemController.createOrder
);
router.get(
  "/list/order/item/api/",
  firebaseMiddleware,
  orderItemController.listOrder
);

module.exports = router;
