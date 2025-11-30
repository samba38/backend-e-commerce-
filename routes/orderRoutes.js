// routes/orderRoutes.js

const express = require("express");
const router = express.Router();

// Auth middleware (protects order routes)
const protect = require("../middleware/authMiddleware");

// Controller functions
const {
  placeOrder,
  getUserOrders,
  getOrderById, // ensure this is exported by the controller
} = require("../controllers/orderController");

// ============================
//         ORDER ROUTES
// ============================

// Create a new order (checkout)
router.post("/", protect, placeOrder);

// Get all orders of a logged-in user
router.get("/", protect, getUserOrders);

// Get a single order by ID
router.get("/:orderId", protect, getOrderById);

module.exports = router;
