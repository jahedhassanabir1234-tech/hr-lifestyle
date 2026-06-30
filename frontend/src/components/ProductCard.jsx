import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import { useState } from "react";
import { getImageUrl } from "../utils/getImageUrl";
import { trackAddToCart } from "../utils/pixel";
import GuestOrderModal from "./GuestOrderModal";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowGuestModal(true);
  };

  const getImageSrc = () => {
    if (imgError) return null;
    if (product.images && product.images.length > 0 && product.images[0]) {
      return getImageUrl(product.images[0]);
    }
    return null;
  };

  const imageSrc = getImageSrc();

  return (
    <>
      <Link to={`/products/${product.slug}`} className="group block">
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col hover:shadow-lg">
          {/* Image */}
          <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={product.name || "Product"}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 gpu-accelerate"
                onError={() => setImgError(true)}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col items-center text-center p-3 flex-grow">
            <h3 className="text-sm font-medium text-gray-800 font-poppins line-clamp-2 min-h-[40px] leading-5">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-2 flex items-center justify-center gap-2">
              {product.discountPrice > 0 ? (
                <>
                  <span className="text-sm text-gray-400 line-through font-poppins">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <span className="text-[#E8572A] font-bold text-base font-poppins">
                    ৳{product.discountPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-[#E8572A] font-bold text-base font-poppins">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Select Option Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isAdding}
              className="flex w-full mt-3 items-center justify-center gap-2 py-2.5 rounded-lg bg-[#222] hover:bg-black text-white text-sm font-poppins transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock <= 0 ? (
                "Out of Stock"
              ) : isAdding ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <FiShoppingCart className="text-white" size={16} />
                  <span>Select Option</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>

      <GuestOrderModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        product={product}
        quantity={1}
      />
    </>
  );
};

export default ProductCard;
