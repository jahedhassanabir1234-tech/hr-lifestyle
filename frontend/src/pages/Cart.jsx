import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <FiShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4 font-poppins">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 font-poppins">Please login to view your cart</p>
        <Link to="/login" className="btn-primary font-poppins">
          Login
        </Link>
      </div>
    );
  }

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
                src={item.product?.images[0] || "/placeholder.jpg"}
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
              <span className="text-gray-600 font-poppins">Shipping</span>
              <span className="font-medium font-poppins">
                {cart.totalPrice > 1000 ? "Free" : "&#2547;60"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-poppins">Tax (5%)</span>
              <span className="font-medium font-poppins">
                &#2547;{(cart.totalPrice * 0.05).toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-lg font-bold font-poppins">Total</span>
              <span className="text-lg font-bold text-red-500 font-poppins">
                &#2547;{(
                  cart.totalPrice +
                  (cart.totalPrice > 1000 ? 0 : 60) +
                  cart.totalPrice * 0.05
                ).toFixed(2)}
              </span>
            </div>
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
    </div>
  );
};

export default Cart;
