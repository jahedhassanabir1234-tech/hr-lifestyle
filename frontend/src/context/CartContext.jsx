import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/cart");
      setCart(data || { items: [] });
    } catch (error) {
      console.error("Cart fetch error:", error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await api.post("/cart", { productId, quantity });
      setCart(data || { items: [] });
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      setCart(data || { items: [] });
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      setCart(data || { items: [] });
      toast.success("Removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setCart({ items: [] });
    } catch (error) {
      console.error(error);
    }
  };

  const cartCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
