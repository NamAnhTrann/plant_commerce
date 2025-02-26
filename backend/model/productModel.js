const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productQuantity: {
    type: Number,
    required: true,
  },
  productCreatedAt: {
    type: Date,
    default: Date.now,
  },
  productCategory: {
    type: String,
    enum: ["small", "large", "collection"],
    required: true,
  },
  productImage: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
