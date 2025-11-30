// Load environment variables
require("dotenv").config();

// Import core packages
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import DB connection
const connectDB = require("./config/db");

// Import routes (we will create these files later)
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ],
  credentials: true,
})
);

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Register backend routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
