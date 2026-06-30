import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiChevronDown,
} from "react-icons/fi";
import api from "../services/api";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenu(false);
  };

  const navLinks = [
    { label: "COMBO OFFERS", to: "/bundle-products" },
    { label: "TOP SELLING", to: "/top-selling-products" },
    { label: "SPECIAL OFFERS", to: "/special-products" },
    { label: "FLASH SALE", to: "/flash-sale" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md">
      {/* Main Navbar */}
      <div className="bg-white md:p-3 p-2 relative z-40 border-b">
        <div className="max-w-[1220px] mx-auto grid items-center grid-cols-3">
          {/* Mobile Menu Button - LEFT */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="rounded-full items-center md:hidden flex text-sm gap-1.5 border p-2 font-semibold text-gray-500"
            >
              {mobileMenu ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>

          {/* Search Bar - LEFT (desktop) */}
          <div className="md:block hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-4 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-poppins transition"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 bg-primary text-white rounded-r-lg hover:bg-primary-600 transition"
              >
                <FiSearch className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Logo - CENTER */}
          <div className="flex justify-center">
            <Link to="/" className="block">
              <Logo className="w-28 md:w-32 h-auto" />
            </Link>
          </div>

          {/* Right Actions - RIGHT */}
          <div className="flex items-center justify-end gap-3 text-primary">
            {/* Account */}
            <div className="relative">
              {user && user.role === "admin" && (
                <>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="md:flex hidden items-center gap-1.5 text-black hover:opacity-80 transition"
                  >
                    <FiUser className="h-[17px] w-[17px]" />
                    <span className="font-normal text-sm font-poppins">Admin</span>
                    <FiChevronDown className="h-3 w-3" />
                  </button>
                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800 font-poppins truncate">{user.name}</p>
                        </div>
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-poppins"
                          onClick={() => setShowDropdown(false)}
                        >
                          <FiPackage className="h-4 w-4" /> Admin Panel
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => { handleLogout(); setShowDropdown(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-poppins"
                        >
                          <FiLogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center text-gray-700 hover:text-primary transition"
            >
              <div className="relative">
                <FiShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-poppins leading-none">
                  {cartCount}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="bg-white p-1 md:hidden block">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary font-poppins"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Category Navigation Bar - Gold/Yellow background */}
      <div className="bg-primary hidden border-b md:block">
        <div className="max-w-[1600px] mx-auto flex uppercase flex-wrap justify-center items-center md:gap-3 gap-1 text-[12px] font-semibold text-white font-[Siyam_Rupali]">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="underline-animate md:px-3 italic px-1 md:py-2 py-1"
            >
              {link.label}
            </Link>
          ))}
          {categories.slice(0, 3).map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="underline-animate md:px-3 italic px-1 md:py-2 py-1"
            >
              {cat.name}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="underline-animate md:px-3 italic px-1 md:py-2 py-1"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white border-b shadow-lg transition-all duration-300 ${mobileMenu ? 'block' : 'hidden'}`}>
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Nav Links */}
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold font-poppins"
                onClick={() => setMobileMenu(false)}
              >
                {link.label}
              </Link>
            ))}

            <hr className="my-2" />

            <Link to="/" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium font-poppins" onClick={() => setMobileMenu(false)}>
              Home
            </Link>
            <Link to="/products" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium font-poppins" onClick={() => setMobileMenu(false)}>
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="block px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-poppins"
                onClick={() => setMobileMenu(false)}
              >
                {cat.name}
              </Link>
            ))}
            <hr className="my-2" />
            {user && user.role === "admin" && (
              <Link to="/admin" className="block px-4 py-3 text-primary hover:bg-gray-50 rounded-lg font-medium font-poppins" onClick={() => setMobileMenu(false)}>
                Admin Panel
              </Link>
            )}
            {user && (
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium font-poppins">
                Logout
              </button>
            )}
          </div>
        </div>
    </header>
  );
};

export default Navbar;
