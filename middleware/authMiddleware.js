// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // Try cookie first (recommended)
    let token = req.cookies?.jwt;

    // Fallback: Authorization: Bearer <token>
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    // add user email/name for convenience
    const user = await User.findById(decoded.id).select("email name");
    if (user) {
      req.userEmail = user.email;
      req.userName = user.name;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error });
  }
};

module.exports = protect;
