import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiPackage, FiSearch } from "react-icons/fi";
import { getImageUrl } from "../utils/getImageUrl";
import { trackEvent } from "../utils/pixel";
import api from "../services/api";

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trackPhone, setTrackPhone] = useState("");
  const [trackOrders, setTrackOrders] = useState([]);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackSearched, setTrackSearched] = useState(false);

  useEffect(() => {
    if (cart?.items?.length > 0) {
      trackEvent("ViewCart", {
        value: cart.totalPrice,
        currency: "BDT",
        num_items: cart.items.length,
        content_ids: cart.items.map((i) => i.product?._id),
      });
    }
  }, [cart]);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackPhone.trim()) return;
    setTrackLoading(true);
    setTrackSearched(true);
    try {
      const { data } = await api.get(`/orders/track/${trackPhone.trim()}`);
      setTrackOrders(data);
    } catch {
      setTrackOrders([]);
    } finally {
      setTrackLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4 font-poppins">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 font-poppins">Add some products to get started</p>
        <Link to="/products" className="btn-primary font-poppins">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-poppins">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg border border-gray-200 flex gap-4"
            >
              <img
                src={getImageUrl(item.product?.images[0]) || "/placeholder.jpg"}
                alt={item.product?.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-grow">
                <Link
                  to={`/products/${item.product?.slug}`}
                  className="font-semibold hover:text-primary transition font-poppins"
                >
                  {item.product?.name}
                </Link>
                <p className="text-red-500 font-bold mt-1 font-poppins">
                  &#2547;{item.product?.discountPrice || item.product?.price}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() =>
                        updateCartItem(item._id, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      <FiMinus className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 font-medium font-poppins">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem(item._id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      <FiPlus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit">
          <h2 className="text-xl font-bold mb-4 font-poppins">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600 font-poppins">Subtotal</span>
              <span className="font-medium font-poppins">&#2547;{cart.totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-poppins">Delivery</span>
              <span className="text-xs font-medium font-poppins text-gray-500">
                ৳80 (Dhaka) / ৳120 (Outside)
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-lg font-bold font-poppins">Subtotal</span>
              <span className="text-lg font-bold text-red-500 font-poppins">
                &#2547;{cart.totalPrice}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-poppins">Delivery charge will be added at checkout</p>
          </div>
          <Link to="/checkout" className="btn-primary block text-center font-poppins">
            Proceed to Checkout
          </Link>
          <Link
            to="/products"
            className="btn-secondary block text-center mt-3 font-poppins"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Tracking Section */}
      <div className="mt-12 bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FiPackage className="h-5 w-5 text-[#E8572A]" />
          <h2 className="text-lg font-bold font-poppins">Track Your Order</h2>
        </div>
        <form onSubmit={handleTrack} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              value={trackPhone}
              onChange={(e) => setTrackPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins"
              required
            />
          </div>
          <button
            type="submit"
            disabled={trackLoading}
            className="bg-[#E8572A] hover:bg-[#D14E25] text-white font-bold px-5 py-2.5 rounded-lg transition text-sm font-poppins disabled:opacity-50"
          >
            {trackLoading ? "..." : "Track"}
          </button>
        </form>

        {trackSearched && !trackLoading && trackOrders.length === 0 && (
          <p className="text-gray-400 text-sm font-poppins text-center py-4">No orders found for this number</p>
        )}

        <div className="space-y-3">
          {trackOrders.map((order) => (
            <div key={order._id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-poppins">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {order.items?.map((it) => it.name).join(", ")}
                </p>
                <p className="text-xs text-gray-400 font-poppins">
                  {new Date(order.createdAt).toLocaleDateString("en-BD", { month: "short", day: "numeric" })}
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize font-poppins ${
                order.status === "delivered" ? "bg-green-100 text-green-700" :
                order.status === "cancelled" ? "bg-red-100 text-red-700" :
                order.status === "shipped" ? "bg-purple-100 text-purple-700" :
                order.status === "processing" ? "bg-blue-100 text-blue-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
