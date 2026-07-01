import { useState } from "react";
import api from "../services/api";
import { FiPackage, FiSearch, FiClock, FiCheckCircle, FiTruck, FiXCircle } from "react-icons/fi";

const statusSteps = ["pending", "processing", "shipped", "delivered"];
const statusColors = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const getStatusIcon = (status) => {
  switch (status) {
    case "pending": return <FiClock className="h-5 w-5" />;
    case "processing": return <FiPackage className="h-5 w-5" />;
    case "shipped": return <FiTruck className="h-5 w-5" />;
    case "delivered": return <FiCheckCircle className="h-5 w-5" />;
    case "cancelled": return <FiXCircle className="h-5 w-5" />;
    default: return <FiClock className="h-5 w-5" />;
  }
};

const TrackOrder = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const { data } = await api.get(`/orders/track/${phone.trim()}`);
      setOrders(data);
    } catch (err) {
      setError("Could not fetch orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[700px] mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E8572A] rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 font-poppins">Track Your Order</h1>
          <p className="text-gray-400 text-sm font-poppins mt-1">Enter your phone number to see order status</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#E8572A] focus:ring-1 focus:ring-[#E8572A] font-poppins"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#E8572A] hover:bg-[#D14E25] text-white font-bold px-6 py-3 rounded-xl transition text-sm font-poppins disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <FiSearch size={16} />
                  Track
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-6">
            <p className="text-red-500 text-sm font-poppins">{error}</p>
          </div>
        )}

        {searched && !loading && orders.length === 0 && !error && (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <FiPackage className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-poppins">No orders found for this phone number</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-poppins">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400 font-poppins">
                    {new Date(order.createdAt).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className={`text-white text-xs font-bold px-3 py-1 rounded-full capitalize font-poppins ${statusColors[order.status] || "bg-gray-400"}`}>
                  {order.status}
                </span>
              </div>

              {/* Status Progress */}
              {order.status !== "cancelled" && (
                <div className="px-4 py-3 bg-gray-50">
                  <div className="flex items-center justify-between relative">
                    {/* Progress bar background */}
                    <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200" />
                    {/* Progress bar fill */}
                    <div
                      className="absolute top-3 left-0 h-0.5 bg-[#E8572A] transition-all duration-500"
                      style={{
                        width: `${(statusSteps.indexOf(order.status) / (statusSteps.length - 1)) * 100}%`,
                      }}
                    />
                    {statusSteps.map((step, i) => {
                      const isActive = statusSteps.indexOf(order.status) >= i;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            isActive ? "bg-[#E8572A] text-white" : "bg-gray-200 text-gray-400"
                          }`}>
                            {isActive ? <FiCheckCircle className="h-3 w-3" /> : i + 1}
                          </div>
                          <span className="text-[9px] text-gray-400 mt-1 capitalize font-poppins">{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {order.status === "cancelled" && (
                <div className="px-4 py-3 bg-red-50 flex items-center gap-2">
                  <FiXCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-500 font-poppins font-medium">This order has been cancelled</span>
                </div>
              )}

              {/* Order Items */}
              <div className="p-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-600 font-poppins">
                      {item.name} <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                    <span className="text-sm font-medium text-gray-800 font-poppins">
                      &#2547;{item.price * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between">
                  <span className="text-sm font-bold text-gray-800 font-poppins">Total</span>
                  <span className="text-sm font-bold text-[#E8572A] font-poppins">&#2547;{order.totalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
