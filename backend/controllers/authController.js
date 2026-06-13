const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOTP } = require("../utils/email");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// @desc    Register a new user (sends OTP)
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      otp,
      otpExpiry,
      isVerified: false,
    });

    try {
      await sendOTP(email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError.message);
    }

    res.status(201).json({
      message: "OTP sent to your email",
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    if (Date.now() > user.otpExpiry.getTime()) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    try {
      await sendOTP(user.email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError.message);
    }

    res.json({ message: "OTP resent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && (await user.comparePassword(password))) {
      if (!user.isVerified) {
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        try {
          await sendOTP(user.email, otp);
        } catch (emailError) {
          console.error("Failed to send OTP email:", emailError.message);
        }

        return res.status(403).json({
          message: "Email not verified. OTP sent to your email.",
          needsVerification: true,
          userId: user._id,
          email: user.email,
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Login / Register
// @route   POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      if (avatar && user.avatar !== avatar) {
        user.avatar = avatar;
      }
      if (!user.isVerified) {
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
      }
      await user.save();
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        avatar: avatar || "",
        isVerified: true,
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  getProfile,
  updateProfile,
  getUsers,
  googleLogin,
};
