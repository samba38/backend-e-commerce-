const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store token inside HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,      // required for cross-site cookies over HTTPS
      sameSite: "none",  // allow cross-site
      path: "/",         
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.json({
      message: "Login successful",
      jwtToken: token,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
