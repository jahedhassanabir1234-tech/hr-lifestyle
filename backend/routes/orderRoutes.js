const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
  createOrder,
  createGuestOrder,
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
router.post("/guest", createGuestOrder);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
