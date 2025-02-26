const mongoose = require("mongoose");

let orderSchema = new mongoose.Schema({
  orderSubtotal: {
    type: Number,
  },
  orderTotalAmount: {
    type: Number,
  },
  orderVAT: {
    type: Number,
  },
  orderStatus: {
    type: String,
    enum: ["COMPLETED", "PENDING", "NOT_COMPLETED"],
  },
  orderCreatedAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Order", orderSchema);
