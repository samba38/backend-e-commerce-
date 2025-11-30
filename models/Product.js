const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids", "Unisex"],
    },

    sizes: {
      type: [String], // ["S", "M", "L", "XL"]
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 50, // default stock
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
