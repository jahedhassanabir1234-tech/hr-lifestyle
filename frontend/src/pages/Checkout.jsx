import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart || cart.items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      setLoading(true);
      await api.post("/orders", {
        shippingAddress,
        paymentMethod,
      });
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-poppins">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 font-poppins">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 font-poppins">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleChange}
                  className="input-field font-poppins"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 font-poppins">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    className="input-field font-poppins"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 font-poppins">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    className="input-field font-poppins"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 font-poppins">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleChange}
                  className="input-field font-poppins"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment & Summary */}
          <div className="space-y-6">
            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4 font-poppins">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: "cod", label: "Cash on Delivery" },
                  { id: "bkash", label: "bKash" },
                  { id: "nagad", label: "Nagad" },
                  { id: "stripe", label: "Stripe (Card)" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 font-poppins"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary"
                    />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4 font-poppins">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cart?.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm font-poppins">
                    <span>
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span>
                      &#2547;{(item.product?.discountPrice || item.product?.price) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between font-poppins">
                  <span>Subtotal</span>
                  <span>&#2547;{cart?.totalPrice}</span>
                </div>
                <div className="flex justify-between font-poppins">
                  <span>Shipping</span>
                  <span>
                    {cart?.totalPrice > 1000 ? "Free" : "&#2547;60"}
                  </span>
                </div>
                <div className="flex justify-between font-poppins">
                  <span>Tax (5%)</span>
                  <span>&#2547;{(cart?.totalPrice * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg font-poppins">
                  <span>Total</span>
                  <span className="text-red-500">
                    &#2547;{(
                      (cart?.totalPrice || 0) +
                      (cart?.totalPrice > 1000 ? 0 : 60) +
                      (cart?.totalPrice || 0) * 0.05
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6 text-center disabled:opacity-50 font-poppins"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
