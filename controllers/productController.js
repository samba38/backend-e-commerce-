const Product = require("../models/Product");

// =============================
// GET ALL PRODUCTS (with search, filter, pagination)
// =============================
exports.getProducts = async (req, res) => {
  try {
    const { search, category, size, minPrice, maxPrice, page = 1, limit = 10 } =
      req.query;

    // Build query object
    let query = {};

    // Search filter (name or description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Size filter
    if (size) {
      query.sizes = size;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Pagination logic
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// =============================
// GET SINGLE PRODUCT BY ID
// =============================
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
