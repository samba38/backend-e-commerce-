// controllers/orderController.js

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const sendOrderEmail = require("../utils/sendEmail");

/**
 * Place an order
 * Steps:
 * 1. Read user's cart
 * 2. Create order document
 * 3. Clear cart
 * 4. Send confirmation email
 */
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price imageURL",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Build order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      size: item.size,
      qty: item.qty,
      price: item.product.price,
    }));

    // Calculate total price
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );

    // Create order document
    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice,
    });

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] }
    );

    // Send email to user
    await sendOrderEmail(newOrder, req.userEmail);

    res.status(201).json({
      message: "Order placed successfully",
      orderId: newOrder._id,
      totalPrice,
    });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Get order history of the user
 */
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ user: userId }).sort({ orderDate: -1 }).populate("items.product", "image name price");

    res.json({ orders });
  } catch (error) {
    console.error("getUserOrders error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Get a single order by ID
 */
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId }).populate("items.product", "image name price");

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    res.json({ order });
  } catch (error) {
    console.error("getOrderById error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};