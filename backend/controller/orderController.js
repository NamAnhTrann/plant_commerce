const Cart = require("../model/cartItemModel");
const Order = require("../model/orderModel");

module.exports = {
  createOrder: async function (req, res) {
    const userId = req.user._id;
    const vatRate = 0.1;
    try {
      const cart = await Cart.findOne({ cartUserId: userId }).populate(
        "items.productId"
      );
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      let subtotal = 0;
      for (let item of cart.items) {
        subtotal += item.productId.productPrice * item.quantity;
      }

      let vat = subtotal * vatRate;
      let totalAmount = vat + subtotal;

      const newOrder = new Order({
        userId,
        orderSubtotal: subtotal,
        orderVAT: vat,
        orderTotalAmount: totalAmount,
        orderStatus: "PENDING",
      });
      await newOrder.save();
      return res
        .status(201)
        .json({ message: "Order created", order: newOrder });
    } catch (err) {
      res.status(500).json({ message: "Error creating order", err });
    }
  },

  listOrderId: async function (req, res) {
    const userId = req.user._id;
    try {
      const order = await Order.findOne({ userId, orderStatus: "PENDING" });
      return res.status(201).json({ order });
    } catch (err) {
      return res.status(500).json({ message: "Error fetching order", error });
    }
  },
};
