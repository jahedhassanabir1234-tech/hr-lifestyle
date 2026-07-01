const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @desc    Create order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0] || "",
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity,
    }));

    const itemsPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const district = (shippingAddress.state || "").toLowerCase();
    const shippingPrice = district.includes("dhaka") ? 80 : 120;
    const taxPrice = 0;
    const totalPrice = Number(
      (itemsPrice + shippingPrice).toFixed(2)
    );

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // Clear the cart
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }).lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;

      if (req.body.trackingNumber) {
        order.trackingNumber = req.body.trackingNumber;
      }

      if (req.body.status === "delivered") {
        order.deliveredAt = Date.now();
      }

      if (req.body.status === "paid") {
        order.paymentStatus = "paid";
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track orders by phone number (public)
// @route   GET /api/orders/track/:phone
const trackOrdersByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const orders = await Order.find({
      guestPhone: phone,
    })
      .select("items totalPrice status guestName guestPhone shippingAddress createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/orders/stats
const getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      deliveredOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create guest order (no auth required)
// @route   POST /api/orders/guest
const createGuestOrder = async (req, res) => {
  try {
    const { items: orderItems, shippingAddress, paymentMethod, guestName, guestPhone, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!guestName || !guestPhone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state) {
      return res.status(400).json({ message: "Full address is required" });
    }

    const items = orderItems.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image || "",
      price: item.price,
      quantity: item.quantity,
    }));

    const itemsPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const district = (shippingAddress.state || "").toLowerCase();
    const shippingPrice = district.includes("dhaka") ? 80 : 120;
    const taxPrice = 0;
    const totalPrice = Number(
      (itemsPrice + shippingPrice).toFixed(2)
    );

    const order = await Order.create({
      guestName,
      guestPhone,
      guestAddress: shippingAddress,
      couponCode: couponCode || "",
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  createGuestOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getStats,
  trackOrdersByPhone,
};
