const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
  getProducts,
  getAdminProducts,
  toggleProductActive,
  getFeaturedProducts,
  getTopSellingProducts,
  getFlashSaleProducts,
  getSpecialProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
} = require("../controllers/productController");

// These MUST come before /:slug to avoid route conflicts
router.get("/featured", getFeaturedProducts);
router.get("/top-selling", getTopSellingProducts);
router.get("/flash-sale", getFlashSaleProducts);
router.get("/special", getSpecialProducts);
router.get("/admin/all", protect, admin, getAdminProducts);

router.get("/", getProducts);
router.get("/:slug", getProduct);

router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.patch("/:id/toggle-active", protect, admin, toggleProductActive);
router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/reviews", protect, createReview);

module.exports = router;
