const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const firebaseMiddleware = require("../middleware/firebaseMiddleware");

router.post("/add/order/api/", firebaseMiddleware, orderController.createOrder);
router.get("/get/order/api/", firebaseMiddleware, orderController.listOrderId);
module.exports = router;
