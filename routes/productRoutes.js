const express = require("express");
const router = express.Router();

const { getProducts, getProductById } = require("../controllers/productController");

// GET all products with filters, search, pagination
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
