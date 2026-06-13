const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getStats,
} = require("../controllers/orderController");

router.get("/stats", protect, admin, getStats);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
