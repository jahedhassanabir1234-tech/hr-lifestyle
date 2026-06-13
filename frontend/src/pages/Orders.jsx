import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { FiShoppingBag } from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-poppins">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <FiShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-4 font-poppins">No orders yet</p>
          <Link to="/products" className="btn-primary font-poppins">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 font-poppins">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 font-poppins">
                    {new Date(order.createdAt).toLocaleDateString("en-BD")}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )} font-poppins`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm font-poppins">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>&#2547;{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <div className="text-sm text-gray-500 font-poppins">
                  Payment: {order.paymentMethod.toUpperCase()}
                </div>
                <div className="font-bold font-poppins">
                  Total: <span className="text-red-500">&#2547;{order.totalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
