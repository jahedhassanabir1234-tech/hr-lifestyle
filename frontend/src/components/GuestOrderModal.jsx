import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { FiX, FiCheck } from "react-icons/fi";

const GuestOrderModal = ({ isOpen, onClose, product, quantity = 1, selectedSize = "" }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    couponCode: "",
  });

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim()) {
      toast.error("Please fill in your full address");
      return;
    }

    try {
      setLoading(true);

      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      const shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode || "1000",
        country: "Bangladesh",
      };

      await api.post("/orders/guest", {
        guestName: formData.name,
        guestPhone: formData.phone,
        shippingAddress,
        paymentMethod: "cod",
        couponCode: formData.couponCode,
        items: [
          {
            product: product._id,
            name: product.name,
            image: product.images?.[0] || "",
            price,
            quantity,
          },
        ],
      });

      setSuccess(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 font-poppins mb-2">Order Placed!</h2>
          <p className="text-gray-500 text-sm font-poppins mb-6">
            Thank you! Your order has been placed successfully. We will contact you soon.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({ name: "", phone: "", street: "", city: "", state: "", zipCode: "", couponCode: "" });
              onClose();
              navigate("/");
            }}
            className="w-full bg-[#E8572A] hover:bg-[#D14E25] text-white font-bold py-3 rounded-xl transition text-sm font-poppins"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const subtotal = price * quantity;
  const shipping = subtotal > 1000 ? 0 : 60;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 font-poppins">Complete Your Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Product Summary */}
        <div className="p-5 border-b border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
              {product.images?.[0] ? (
                <img
                  src={product.images[0].startsWith("http") ? product.images[0] : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 font-poppins truncate">{product.name}</p>
              {selectedSize && <p className="text-xs text-gray-400 font-poppins">Size: {selectedSize}</p>}
              <p className="text-xs text-gray-400 font-poppins">Qty: {quantity}</p>
              <p className="text-sm font-bold text-[#E8572A] font-poppins mt-1">৳{price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">Full Address *</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="House #, Road #, Area, Thana"
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Dhaka"
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">District *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Dhaka"
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">Zip</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="1000"
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins"
              />
            </div>
          </div>

          {/* Coupon */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">Coupon Code (optional)</label>
            <input
              type="text"
              name="couponCode"
              value={formData.couponCode}
              onChange={handleChange}
              placeholder="Enter coupon code"
              className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm font-poppins">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-poppins">
              <span className="text-gray-500">Shipping</span>
              <span className="font-medium text-green-600">{shipping === 0 ? "Free" : `৳${shipping}`}</span>
            </div>
            <div className="flex justify-between text-sm font-poppins">
              <span className="text-gray-500">Tax (5%)</span>
              <span className="font-medium">৳{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-poppins">
              <span className="font-bold">Total</span>
              <span className="font-bold text-[#E8572A]">৳{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600 font-poppins font-medium">Cash on Delivery - Pay when you receive</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8572A] hover:bg-[#D14E25] text-white font-bold py-3.5 rounded-xl transition text-sm font-poppins disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>Place Order - ৳{total.toFixed(2)}</>
            )}
          </button>

          <p className="text-center text-[10px] text-gray-400 font-poppins">
            By placing this order, you agree to our Terms & Conditions
          </p>
        </form>
      </div>
    </div>
  );
};

export default GuestOrderModal;
