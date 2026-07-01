import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FiMapPin, FiCreditCard, FiCheck, FiShoppingBag, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { trackInitiateCheckout, trackPurchase } from "../utils/pixel";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [guestName, setGuestName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [couponCode, setCouponCode] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "Bangladesh",
  });

  useEffect(() => {
    if (cart?.items?.length > 0) {
      trackInitiateCheckout(cart.totalPrice, cart.items);
    }
  }, []);

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (!guestName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state) {
      toast.error("Please fill in your full address");
      return;
    }
    try {
      setLoading(true);

      if (user) {
        await api.post("/orders", {
          shippingAddress,
          paymentMethod: "cod",
          phone,
        });
      } else {
        const orderItems = cart.items.map((item) => ({
          product: item.product?._id,
          name: item.product?.name,
          image: item.product?.images?.[0] || "",
          price: item.product?.discountPrice || item.product?.price,
          quantity: item.quantity,
        }));

        await api.post("/orders/guest", {
          guestName,
          guestPhone: phone,
          shippingAddress,
          paymentMethod: "cod",
          couponCode,
          items: orderItems,
        });
      }

      trackPurchase(total, cart.items);
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart?.totalPrice || 0;
  const isDhaka = (shippingAddress.city || "").toLowerCase().includes("dhaka");
  const shipping = isDhaka ? 80 : 120;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1100px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#E8572A] rounded-full flex items-center justify-center">
            <FiLock className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 font-poppins">Checkout</h1>
            <p className="text-gray-400 text-xs font-poppins">Secure checkout - Cash on Delivery</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* LEFT: Forms */}
            <div className="lg:col-span-3 space-y-6">

              {/* Contact */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-[#E8572A] rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <h2 className="text-base font-bold text-gray-800 font-poppins">Contact Information</h2>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">Full Name *</label>
                      <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Your full name" className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">Phone *</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-[#E8572A] rounded-full flex items-center justify-center">
                    <FiMapPin className="text-white" size={14} />
                  </div>
                  <h2 className="text-base font-bold text-gray-800 font-poppins">Shipping Address</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">Full Address *</label>
                    <input type="text" name="street" value={shippingAddress.street} onChange={handleChange} placeholder="House #, Road #, Area, Thana" className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins" required />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">City *</label>
                      <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} placeholder="Dhaka" className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">District *</label>
                      <input type="text" name="state" value={shippingAddress.state} onChange={handleChange} placeholder="Dhaka" className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins" required />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1 font-poppins">Zip Code</label>
                      <input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleChange} placeholder="1000" className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-[#E8572A] rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <h2 className="text-base font-bold text-gray-800 font-poppins">Coupon Code (optional)</h2>
                </div>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code if you have one"
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins"
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-[#E8572A] rounded-full flex items-center justify-center">
                    <FiCreditCard className="text-white" size={14} />
                  </div>
                  <h2 className="text-base font-bold text-gray-800 font-poppins">Payment Method</h2>
                </div>

                {/* COD Option */}
                <label className="flex items-center gap-4 p-4 border-2 border-[#E8572A] rounded-xl bg-orange-50 cursor-pointer mb-3">
                  <div className="w-5 h-5 rounded-full border-4 border-[#E8572A] flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#E8572A] rounded-full" />
                  </div>
                  <FiCheck className="text-[#E8572A] -ml-2" size={14} />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800 text-sm font-poppins">Cash on Delivery</span>
                    <p className="text-gray-400 text-xs font-poppins">Pay when you receive your order</p>
                  </div>
                  <FiShoppingBag className="text-[#E8572A]" size={20} />
                </label>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-[100px]">
                <h2 className="text-base font-bold text-gray-800 mb-4 font-poppins">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
                  {cart?.items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0].startsWith("http") ? item.product.images[0] : `${import.meta.env.VITE_API_URL?.replace("/api", "")}${item.product.images[0]}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiShoppingBag className="text-gray-300" size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate font-poppins">{item.product?.name}</p>
                        <p className="text-xs text-gray-400 font-poppins">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 font-poppins">
                        &#2547;{(item.product?.discountPrice || item.product?.price) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-100 mb-4" />

                {/* Totals */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between text-sm font-poppins">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">&#2547;{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-poppins">
                    <span className="text-gray-500">Delivery</span>
                    <span className="font-medium text-green-600">
                      {isDhaka ? "Dhaka" : "Outside Dhaka"} - &#2547;{shipping}
                    </span>
                  </div>
                </div>

                <hr className="border-gray-100 mb-4" />

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-gray-800 font-poppins">Total</span>
                  <span className="text-xl font-bold text-[#E8572A] font-poppins">&#2547;{total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E8572A] hover:bg-[#D14E25] text-white font-bold py-3.5 rounded-xl transition text-sm font-poppins disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <FiLock size={14} />
                      Place Order - &#2547;{total.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-gray-400 mt-3 font-poppins">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
