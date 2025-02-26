const express = require("express");
const router = express.Router();
const firebaseMiddleware = require("../middleware/firebaseMiddleware");
const cartController = require("../controller/cartItemController");

router.post(
  "/add/to/cart/api/",
  firebaseMiddleware,
  cartController.addItemToCart
);
router.get(
  "/list/cart/api/:id",
  firebaseMiddleware,
  cartController.listCartItem
);

router.delete("/reduce/cart/item/api/:id", cartController.reduceCartItem);

module.exports = router;
