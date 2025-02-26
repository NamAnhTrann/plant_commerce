const Cart = require("../model/cartItemModel");
const Product = require("../model/productModel");
const Order = require("../model/orderModel");

module.exports = {
  addItemToCart: async function (req, res) {
    const { cartQuantity = 1, productId } = req.body;
    const vatRate = 0.1;
    if (!req.user || !req.user._id) {
      console.error(" req.user is missing or undefined!");
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }
    const userId = req.user._id;
    console.log(" User ID extracted:", userId);

    try {
      const products = await Product.findOneAndUpdate(
        { _id: productId, productQuantity: { $gte: cartQuantity } },
        { new: true }
      );
      if (!products) {
        console.log("No product to fetch data");
        return res.status(404).json({ message: "Error, no product" });
      }

      let cart = await Cart.findOne({ cartUserId: userId });
      console.log(cart);
      if (!cart) {
        cart = new Cart({ cartUserId: userId, items: [] });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += cartQuantity;
      } else {
        cart.items.push({ productId, quantity: cartQuantity });
      }
      await cart.save();

      //order
      let order = await Order.findOne({ userId, orderStatus: "PENDING" });
      if (!order) {
        order = new Order({
          userId,
          orderSubtotal: 0,
          orderVAT: 0,
          orderTotalAmount: 0,
          orderStatus: "PENDING",
        });
      }

      const populateCart = await Cart.findOne({ cartUserId: userId }).populate(
        "items.productId"
      );

      let subtotal = 0;
      for (let item of populateCart.items) {
        subtotal += item.productId.productPrice * item.quantity;
      }

      let vat = subtotal * vatRate;
      let totalAmount = vat + subtotal;

      order.orderSubtotal = subtotal;
      order.orderVAT = vat;
      order.orderTotalAmount = totalAmount;

      await order.save();

      return res.status(201).json({
        message: "Item added to cart successfully",
        cart: cart,
        order: order,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error adding item to cart and updating order", err });
    }
  },

  listCartItem: async function (req, res) {
    const userId = req.user._id;
    try {
      const cart = await Cart.findOne({ cartUserId: userId }).populate(
        "items.productId"
      );

      if (!cart) {
        console.log("no cart to list", cart);
        return res.status(200).json({ cart: { items: [] } });
      }
      return res.status(200).json({ cart });
    } catch (err) {
      return res.status(404).json({ message: "Error", err });
    }
  },

  //remove the entire cart
  removeEntireCart: async function (req, res) {
    const cartId = req.params.id;
    try {
      const cart = await Cart.findById(cartId);

      for (let item of cart.items) {
        const product = await Product.findById(item.productId);
        product.productQuantity += item.quantity;
        await product.save();
      }

      await Cart.findByIdAndDelete(cartId);
      return res.status(201).json({ message: "cart item removed" }, product);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error removing cart item", error: err.message });
    }
  },

  reduceCartItem: async function (req, res) {
    const cartId = req.params.id;
    const { productId } = req.body;
    const vatRate = 0.1;

    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        console.log("Cart does not exist");
        return res.status(400).json({ message: "No cart found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      const product = await Product.findById(productId);
      if (product) {
        product.productQuantity += cart.items[itemIndex].quantity;
        await product.save();
      }

      cart.items.splice(itemIndex, 1);

      if (cart.items.length === 0) {
        console.log("🟡 Cart is empty. Deleting cart and order...");
        console.log("🟡 Checking cartUserId:", cart.cartUserId);

        await Cart.findByIdAndDelete(cartId);
        const deleteOrder = await Order.findOneAndDelete({
          userId: cart.cartUserId?.toString(),
          orderStatus: "PENDING",
        });

        if (deleteOrder) {
          //all of this because of the fucking extra space in "PENDING "
          console.log(" Order deleted successfully");
        } else {
          console.log(" No matching order found to delete");
        }

        return res
          .status(200)
          .json({ message: "Cart and Order has been deleted as it is empty" });
      } else {
        await cart.save();

        let order = await Order.findOne({
          userId: cart.cartUserId,
          orderStatus: "PENDING",
        });
        if (order) {
          let subtotal = 0;
          for (let item of cart.items) {
            const itemProduct = await Product.findById(item.productId);
            if (itemProduct) {
              subtotal += itemProduct.productPrice * item.quantity;
            }
          }

          let vat = subtotal * vatRate;
          let totalAmount = subtotal + vat;

          order.orderSubtotal = subtotal;
          order.orderVAT = vat;
          order.orderTotalAmount = totalAmount;

          await order.save();
        }

        return res
          .status(201)
          .json({ message: "Item removed from cart and order", cart, order });
      }
    } catch (err) {
      console.error("Error removing item from cart:", err);
      return res
        .status(500)
        .json({ message: "Error removing item", error: err.message });
    }
  },
};
