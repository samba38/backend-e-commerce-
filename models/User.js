const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",   // admin/user if needed
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

// Export model
module.exports = mongoose.model("User", userSchema);
