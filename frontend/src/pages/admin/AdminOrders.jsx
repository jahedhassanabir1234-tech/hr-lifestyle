import { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to load orders. Backend server may be offline.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated!");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium mb-2">Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button onClick={fetchOrders} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Orders ({orders.length})</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">No orders yet</p>
            <p className="text-sm">Orders from customers will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Payment</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{order.user?.name || "N/A"}</p>
                      <p className="text-xs text-gray-500">{order.user?.email || ""}</p>
                      {order.user?.phone && <p className="text-xs text-gray-500">{order.user.phone}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{order.shippingAddress?.street || "-"}</p>
                      <p>{[order.shippingAddress?.city, order.shippingAddress?.state].filter(Boolean).join(", ")}</p>
                      <p>{order.shippingAddress?.zipCode} {order.shippingAddress?.country || "Bangladesh"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.items?.map((item, i) => (
                        <p key={i}>{item.name} x{item.quantity}</p>
                      ))}
                    </td>
                    <td className="px-6 py-4 font-medium">৳{order.totalPrice}</td>
                    <td className="px-6 py-4 text-sm uppercase font-medium">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
