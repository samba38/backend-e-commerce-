const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // Read token from HTTP-only cookie
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add userId to request so controllers can use it
    req.userId = decoded.id;

     // Fetch user email
    const user = await User.findById(decoded.id).select("email name");
    req.userEmail = user.email;
    req.userName = user.name;

    next(); // move to next middleware / controller
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error });
  }
};

module.exports = protect;
