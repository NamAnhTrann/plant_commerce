require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const orderItem = require("../model/orderItemModel");
const Order = require("../model/orderModel");
const Cart = require("../model/cartItemModel");
const Product = require("../model/productModel");

module.exports = {
  createPayment: async function (req, res) {
    const userId = req.user._id;

    try {
      let orderItems = await orderItem
        .findOne({ orderItemUserId: userId })
        .populate("orderItemOrderId");

      if (
        !orderItems ||
        orderItems.orderItemOrderId.orderStatus === "COMPLETED"
      ) {
        const cart = await Cart.findOne({ cartUserId: userId });
        if (!cart) {
          return res.status(404).json({ message: "No cart found" });
        }

        let order = await Order.findOne({
          userId: userId,
          orderStatus: "PENDING",
        });
        if (!order) {
          order = new Order({
            userId,
            orderSubtotal: 0,
            orderVAT: 0,
            orderTotalAmount: 0,
            orderStatus: "PENDING",
          });
          await order.save();
        }

        const newOrderItem = new orderItem({
          orderItemCartId: cart._id,
          orderItemOrderId: order._id,
          orderItemUserId: userId,
          cartSnapshot: cart.items,
        });

        await newOrderItem.save();
        orderItems = newOrderItem;
      }

      orderItems = await orderItem
        .findById(orderItems._id)
        .populate({
          path: "orderItemCartId",
          populate: { path: "items.productId" },
        })
        .populate("orderItemOrderId");

      if (!orderItems || !orderItems.orderItemCartId) {
        return res.status(404).json({ message: "No valid order found" });
      }

      const totalAmount = Math.round(
        orderItems.orderItemOrderId.orderTotalAmount * 100
      );
      if (!totalAmount) {
        return res
          .status(404)
          .json({ message: "Error: No total amount", totalAmount });
      }

      const lineItems = orderItems.orderItemCartId.items.map((item) => ({
        price_data: {
          currency: "aud",
          product_data: {
            name: item.productId.productName,
          },
          unit_amount: Math.round(item.productId.productPrice * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: req.user.email,
        line_items: lineItems,
        payment_method_types: [
          "card",
          "afterpay_clearpay",
          "zip",
          "wechat_pay",
          "alipay",
        ],
        payment_method_options: { wechat_pay: { client: "web" } },
        metadata: {
          userId: userId.toString(),
          orderId: orderItems._id.toString(),
          orderTotal: orderItems.orderItemOrderId.orderTotalAmount,
          cartId: orderItems.orderItemCartId._id.toString(),
        },
        locale: "auto",

        success_url: `${process.env.CLIENT_URL}/#/order-summary?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/#/list-product`,
      });

      return res.status(200).json({ url: session.url });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Payment failed", error: err.message });
    }
  },

  confirmPayment: async function (req, res) {
    const userId = req.user._id;
    console.log("UserId is: ", userId);

    // FIX: Change from paymentIntentId to session_id
    const { session_id } = req.body;

    try {
      // FIX: Retrieve session details from Stripe
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (!session || !session.payment_intent) {
        return res
          .status(400)
          .json({ message: "Invalid session ID or payment not completed" });
      }

      const paymentIntentId = session.payment_intent;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment not completed" });
      }

      // Continue with the rest of the order update logic...
      let orderItems = await orderItem
        .findOne({ orderItemUserId: userId })
        .sort({ _id: -1 })
        .populate({
          path: "orderItemCartId",
          populate: { path: "items.productId" },
        })
        .populate("orderItemOrderId");

      if (!orderItems) {
        console.error("No orderItems found for user:", userId);
        return res.status(400).json({ message: "No order found" });
      }

      if (!orderItems.orderItemCartId) {
        console.warn("orderItemCartId is null. Finding new cart for user...");
        const newCart = await Cart.findOne({ cartUserId: userId }).sort({
          _id: -1,
        });

        if (!newCart) {
          console.error("No new cart found for user:", userId);
          return res.status(400).json({
            message: "No active cart found. Please add items to the cart.",
          });
        }

        orderItems.orderItemCartId = newCart._id;
        await orderItems.save();
        console.log("Updated orderItemCartId:", orderItems.orderItemCartId);
      }

      const latestOrder = await Order.findOne({ userId: userId }).sort({
        _id: -1,
      });

      if (!latestOrder) {
        return res.status(400).json({ message: "No valid order found" });
      }

      if (
        orderItems.orderItemCartId?.items &&
        Array.isArray(orderItems.orderItemCartId.items)
      ) {
        for (let item of orderItems.orderItemCartId.items) {
          if (!item.productId) continue;
          const product = await Product.findById(item.productId);
          if (product) {
            product.productQuantity -= item.quantity;
            await product.save();
          }
        }

        orderItems.cartSnapshot = [...orderItems.orderItemCartId.items];
        await orderItems.save();
      } else {
        console.warn(
          "orderItemCartId.items is missing or empty. Skipping quantity update."
        );
      }

      await Order.findOneAndUpdate(
        { _id: latestOrder._id },
        { orderStatus: "COMPLETED" }
      );

      await Cart.findByIdAndDelete(orderItems.orderItemCartId._id);

      return res
        .status(200)
        .json({ message: "Payment successful, cart cleared, order completed" });
    } catch (err) {
      console.error("Payment confirmation error:", err);
      return res
        .status(500)
        .json({ message: "Payment confirmation failed", error: err.message });
    }
  },
};
