// controllers/cartController.js

const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * Get the current user's cart
 * Assumes auth middleware sets req.userId
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    // Find cart and populate product details for convenience
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price image stock",
    });

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    // Calculate total price (use populated product prices)
    const totalPrice = cart.items.reduce((sum, item) => {
      const price = item.product ? item.product.price : 0;
      return sum + price * item.qty;
    }, 0);

    res.json({ items: cart.items, totalPrice });
  } catch (error) {
    console.error("getCart error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Add an item to cart (or increase qty if same product+size exists)
 * body: { productId, size, qty }
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { productId, size, qty = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optional stock check (bonus)
    if (product.stock != null && qty > product.stock) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if same product+size already in cart
    const existingIndex = cart.items.findIndex(
      (it) => it.product.toString() === productId && it.size === size
    );

    if (existingIndex > -1) {
      // Increase quantity
      cart.items[existingIndex].qty += Number(qty);
    } else {
      // Push new item
      cart.items.push({ product: productId, size, qty: Number(qty) });
    }

    await cart.save();

    // Return updated cart (populate for convenience)
    const populated = await cart.populate({
      path: "items.product",
      select: "name price image stock",
    });

    res.status(200).json({ message: "Added to cart", cart: populated });
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Update an item's quantity in cart
 * body: { productId, size, qty }
 * If qty <= 0 you can remove the item.
 */
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { productId, size, qty } = req.body;
    if (qty == null) return res.status(400).json({ message: "qty is required" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex(
      (it) => it.product.toString() === productId && it.size === size
    );

    if (idx === -1) return res.status(404).json({ message: "Item not found in cart" });

    if (Number(qty) <= 0) {
      // Remove item
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].qty = Number(qty);
    }

    await cart.save();

    const populated = await cart.populate({
      path: "items.product",
      select: "name price image stock",
    });

    res.json({ message: "Cart updated", cart: populated });
  } catch (error) {
    console.error("updateCartItem error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Remove an item from cart
 * body: { productId, size }
 */
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { productId, size } = req.body;
    if (!productId || !size) {
      return res.status(400).json({ message: "productId and size are required" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (it) => !(it.product.toString() === productId && it.size === size)
    );

    await cart.save();

    const populated = await cart.populate({
      path: "items.product",
      select: "name price image stock",
    });

    res.json({ message: "Item removed", cart: populated });
  } catch (error) {
    console.error("removeCartItem error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Clear cart (used after successful checkout)
 */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { upsert: true });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("clearCart error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Merge guest cart into user cart (optional helper)
 * body: { items: [{ productId, size, qty }, ...] }
 * Called after login to merge localStorage cart with server cart.
 */
exports.mergeCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const guestItems = req.body.items || [];

    // Find or create user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    // Merge logic: add each guest item into cart (combine qty if same product+size)
    guestItems.forEach((g) => {
      const existingIndex = cart.items.findIndex(
        (it) => it.product.toString() === g.productId && it.size === g.size
      );
      if (existingIndex > -1) {
        cart.items[existingIndex].qty += Number(g.qty || 1);
      } else {
        cart.items.push({ product: g.productId, size: g.size, qty: Number(g.qty || 1) });
      }
    });

    await cart.save();

    const populated = await cart.populate({
      path: "items.product",
      select: "name price image stock",
    });

    res.json({ message: "Cart merged", cart: populated });
  } catch (error) {
    console.error("mergeCart error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
