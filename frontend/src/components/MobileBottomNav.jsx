import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiHome, FiGrid, FiShoppingCart } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const MobileBottomNav = () => {
  const { cartCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 sm:hidden pb-safe">
      <div className="flex items-center justify-around py-2 px-1">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition ${
            isActive("/") ? "text-[#E8572A]" : "text-gray-500"
          }`}
        >
          <FiHome className="h-5 w-5" />
          <span className="text-[10px] font-poppins font-medium">Home</span>
        </Link>

        <Link
          to="/products"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition ${
            isActive("/products") ? "text-[#E8572A]" : "text-gray-500"
          }`}
        >
          <FiGrid className="h-5 w-5" />
          <span className="text-[10px] font-poppins font-medium">Products</span>
        </Link>

        <Link
          to="/cart"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition relative ${
            isActive("/cart") ? "text-[#E8572A]" : "text-gray-500"
          }`}
        >
          <div className="relative">
            <FiShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center leading-none">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-poppins font-medium">Cart</span>
        </Link>

        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition text-gray-500"
        >
          <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
          <span className="text-[10px] font-poppins font-medium">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default MobileBottomNav;
