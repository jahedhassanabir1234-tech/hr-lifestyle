import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  HiShoppingBag,
  HiCurrencyBangladeshi,
  HiClock,
  HiCheckCircle,
  HiClipboardList,
  HiCog,
} from "react-icons/hi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get("/orders/stats").catch((e) => {
            console.warn("Stats API failed:", e.message);
            return { data: { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, deliveredOrders: 0 } };
          }),
          api.get("/orders").catch((e) => {
            console.warn("Orders API failed:", e.message);
            return { data: [] };
          }),
        ]);

        const productsRes = await api.get("/products/admin/all").catch((e) => {
          console.warn("Products API failed:", e.message);
          return { data: [] };
        });

        setStats({
          ...statsRes.data,
          totalProducts: Array.isArray(productsRes.data) ? productsRes.data.length : 0,
        });
        setRecentOrders(Array.isArray(ordersRes.data) ? ordersRes.data.slice(0, 5) : []);
      } catch (error) {
        console.error("Dashboard error:", error);
        setError("Failed to load dashboard data. Make sure backend server is running on port 5000.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium mb-2">Connection Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <div className="bg-gray-100 rounded-lg p-4 text-left text-sm text-gray-700 mb-4">
            <p className="font-semibold mb-2">Steps to fix:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open terminal and go to <code className="bg-gray-200 px-1 rounded">HR-Lifestyle/backend</code></li>
              <li>Run <code className="bg-gray-200 px-1 rounded">npm install</code></li>
              <li>Run <code className="bg-gray-200 px-1 rounded">node seed.js</code> (first time only)</li>
              <li>Run <code className="bg-gray-200 px-1 rounded">npm run dev</code></li>
              <li>Make sure backend is running on port 5000</li>
            </ol>
          </div>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <HiShoppingBag className="h-10 w-10 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <HiCurrencyBangladeshi className="h-10 w-10 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">
                ৳{stats.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <HiClock className="h-10 w-10 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <HiCheckCircle className="h-10 w-10 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/products"
          className="bg-primary-600 text-white p-6 rounded-lg shadow-md hover:bg-primary-700 transition text-center"
        >
          <HiShoppingBag className="h-8 w-8 mx-auto mb-2" />
          <h3 className="text-xl font-bold">Manage Products</h3>
          <p className="text-sm opacity-80">{stats.totalProducts} products</p>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition text-center"
        >
          <HiClipboardList className="h-8 w-8 mx-auto mb-2" />
          <h3 className="text-xl font-bold">Manage Orders</h3>
          <p className="text-sm opacity-80">{stats.totalOrders} orders</p>
        </Link>
        <Link
          to="/admin/categories"
          className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition text-center"
        >
          <HiCog className="h-8 w-8 mx-auto mb-2" />
          <h3 className="text-xl font-bold">Manage Categories</h3>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <HiShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No orders yet. Orders will appear here once customers start buying.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Order ID</th>
                  <th className="text-left py-3">Customer</th>
                  <th className="text-left py-3">Total</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 text-sm">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3">{order.guestName || order.user?.name || "N/A"}</td>
                    <td className="py-3 font-medium">৳{order.totalPrice}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
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

export default Dashboard;
