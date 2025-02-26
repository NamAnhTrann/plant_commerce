const OrderItem = require("../model/orderItemModel");
const Order = require("../model/orderModel.js");
const Cart = require("../model/cartItemModel.js");

module.exports = {
  createOrder: async function (req, res) {
    const userId = req.user._id;
    try {
      const order = await Order.findOne({ userId: userId });
      if (!order) {
        console.log("Order do not exist");
        return res.status(404).json({ message: "No order" });
      }

      const cart = await Cart.findOne({ cartUserId: userId });
      if (!cart) {
        console.log("No cart");
        return res.status(404).json({ message: "No cart" });
      }

      const newOrderItem = new OrderItem({
        orderItemCartId: cart._id,
        orderItemOrderId: order._id,
        orderItemUserId: userId,
      });
      await newOrderItem.save();

      const populatedDetails = await OrderItem.findById(newOrderItem._id)
        .populate("orderItemCartId")
        .populate("orderItemOrderId")
        .populate("orderItemUserId");
      console.log("OrderItem Created:", populatedDetails);
      if (!populatedDetails) {
        console.log("Error");
        return res.status(404).json({ message: "error" });
      }

      return res
        .status(201)
        .json({ message: "OrderItem created", orderItem: populatedDetails });
    } catch (err) {
      res.status(500).json({ message: "Server error", err });
    }
  },

  listOrder: async function (req, res) {
    const userId = req.user._id;
    try {
      const orderItems = await OrderItem.findOne({ orderItemUserId: userId })
        .sort({ _id: -1 })
        .populate({
          path: "orderItemCartId",
          populate: {
            path: "items.productId",
          },
        })
        .populate("orderItemOrderId")
        .populate("orderItemUserId")
        .populate({
          path: "cartSnapshot.productId",
        });

      if (!orderItems) {
        console.log("No order item to list");
        return res.status(404).json({ message: "Error, no order item" });
      }

      return res
        .status(200)
        .json({ message: "Order Items fetched", orderItems });
    } catch (err) {
      console.error("Server error:", err);
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },
};
