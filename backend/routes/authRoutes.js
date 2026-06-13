const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
  register,
  verifyOTP,
  resendOTP,
  login,
  getProfile,
  updateProfile,
  getUsers,
  googleLogin,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/users", protect, admin, getUsers);

module.exports = router;
