// routes/cartRoutes.js

const express = require("express");
const router = express.Router();

// Import cart controller functions
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
} = require("../controllers/cartController");

// Import auth middleware (protect routes)
const authMiddleware = require("../middleware/authMiddleware");

// All cart routes require the user to be logged in, so we use authMiddleware

// Get user's cart
router.get("/", authMiddleware, getCart);

// Add item to cart
router.post("/add", authMiddleware, addToCart);

// Update quantity of product in cart
router.put("/update", authMiddleware, updateCartItem);

// Remove a specific cart item
router.delete("/remove", authMiddleware, removeCartItem);

// Clear cart after checkout
router.delete("/clear", authMiddleware, clearCart);

// Merge guest cart (localStorage cart)
router.post("/merge", authMiddleware, mergeCart);

module.exports = router;
