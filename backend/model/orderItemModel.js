const mongoose = require("mongoose");

let orderItemSchema = new mongoose.Schema({
  orderItemCartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  orderItemOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  orderItemUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cartSnapshot: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});
module.exports = mongoose.model("OrderItem", orderItemSchema);
