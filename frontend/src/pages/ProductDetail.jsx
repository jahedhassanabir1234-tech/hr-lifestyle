import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { BsMessenger } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/getImageUrl";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!user) { navigate("/register"); return; }
    if (product.sizes?.length > 0 && !selectedSize) { toast.error("Please select a size"); return; }
    addToCart(product._id, quantity);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!user) { navigate("/register"); return; }
    if (product.sizes?.length > 0 && !selectedSize) { toast.error("Please select a size"); return; }
    addToCart(product._id, quantity);
    window.location.href = "/checkout";
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to add a review"); return; }
    try {
      setSubmitting(true);
      await api.post(`/products/${product._id}/reviews`, { rating, comment });
      toast.success("Review added!");
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg font-poppins">Product not found</p>
      </div>
    );
  }

  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasSizeChart = product.sizeChart && product.sizeChart.length > 0;
  const sizeChartHeaders = hasSizeChart ? Object.keys(product.sizeChart[0]).filter(k => product.sizeChart[0][k]) : [];

  return (
    <div className="max-w-[1220px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: Images */}
        <div className="lg:sticky lg:top-[90px] lg:self-start">
          <div className="relative border border-gray-200 rounded-lg overflow-hidden mb-3">
            {product.images && product.images[selectedImage] ? (
              <img src={getImageUrl(product.images[selectedImage])} alt={product.name} className="w-full h-auto object-cover" />
            ) : (
              <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <FiShoppingCart className="h-16 w-16 text-gray-300" />
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-[75px] h-[75px] rounded overflow-hidden border-2 flex-shrink-0 ${selectedImage === i ? "border-primary" : "border-gray-200"}`}>
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Info */}
        <div className="font-poppins">
          <span className="text-gray-400 text-[11px] uppercase tracking-wider">{product.category?.name || ""}</span>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mt-2 mb-4 leading-snug">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-5">
            {product.discountPrice > 0 ? (
              <>
                <span className="text-gray-400 line-through text-lg">৳{product.price.toLocaleString()}</span>
                <span className="text-primary text-3xl font-bold">৳{product.discountPrice.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-primary text-3xl font-bold">৳{product.price.toLocaleString()}</span>
            )}
          </div>

          {/* Size Chart (dynamic from admin) */}
          {hasSizeChart && (
            <div className="mb-5">
              <h3 className="font-semibold text-gray-800 text-sm mb-2">Size Chart</h3>
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-[11px] text-center">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th colSpan={sizeChartHeaders.length} className="py-2 font-semibold text-xs">SIZE GUIDE</th>
                    </tr>
                    <tr className="bg-primary/90 text-white text-[10px]">
                      {sizeChartHeaders.map((key) => (
                        <th key={key} className="py-1.5 px-1 capitalize">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeChart.map((row, i) => (
                      <tr key={i} className={`border-t border-gray-100 ${i % 2 === 1 ? "bg-gray-50" : ""}`}>
                        {sizeChartHeaders.map((key) => (
                          <td key={key} className="py-1.5 px-1">{row[key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Choice Size (dynamic from admin) */}
          {hasSizes && (
            <div className="mb-5">
              <h3 className="font-semibold text-gray-800 text-sm mb-2">Choice Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`w-12 h-9 border rounded text-xs font-medium transition ${selectedSize === size ? "border-primary bg-primary text-white" : "border-gray-300 bg-white text-gray-700 hover:border-primary"}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-5">
            <label className="font-semibold text-gray-800 text-sm block mb-2">Quantity:</label>
            <div className="inline-flex items-center border border-gray-300 rounded">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-lg font-bold">-</button>
              <span className="w-12 text-center border-x border-gray-300 h-9 flex items-center justify-center text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-lg font-bold">+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-5">
            <button onClick={handleAddToCart} disabled={product.stock <= 0}
              className="flex-1 bg-primary hover:bg-primary-600 text-white font-semibold py-3 rounded transition text-sm tracking-wide disabled:opacity-50">
              ADD TO CART
            </button>
            <button onClick={handleBuyNow} disabled={product.stock <= 0}
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded transition text-sm tracking-wide disabled:opacity-50">
              BUY NOW
            </button>
          </div>

          {/* Messenger */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-3 text-center">
            <p className="font-hind font-semibold text-gray-800 mb-1 text-sm">সহজেই মেসেঞ্জারে অর্ডার করুন:</p>
            <a href="#" className="text-blue-600 underline text-xs block mb-3">Facebook Messenger</a>
            <a href="https://www.messenger.com/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0078FF] hover:bg-[#0066DD] text-white font-semibold py-2.5 px-6 rounded transition text-xs">
              <BsMessenger size={18} /> ORDER ON MESSENGER
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-5 text-center">
            <p className="font-hind font-semibold text-gray-800 mb-3 text-sm">সহজেই হোয়াটসঅ্যাপে অর্ডার করুন:</p>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-2.5 px-6 rounded transition text-xs">
              <FaWhatsapp size={18} /> ORDER ON WHATSAPP
            </a>
          </div>

          {/* Details Table */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <div className="flex border-b border-gray-100">
              <span className="w-32 bg-gray-50 px-3 py-2.5 text-gray-500 text-xs font-medium border-r border-gray-100">Available:</span>
              <span className="px-3 py-2.5 text-xs text-gray-800">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
            </div>
            <div className="flex border-b border-gray-100">
              <span className="w-32 bg-gray-50 px-3 py-2.5 text-gray-500 text-xs font-medium border-r border-gray-100">SKU:</span>
              <span className="px-3 py-2.5 text-xs text-gray-800">{product.sku || product._id?.slice(-10) || "N/A"}</span>
            </div>
            <div className="flex border-b border-gray-100">
              <span className="w-32 bg-gray-50 px-3 py-2.5 text-gray-500 text-xs font-medium border-r border-gray-100">Categories:</span>
              <span className="px-3 py-2.5 text-xs"><Link to={`/products?category=${product.category?._id}`} className="text-primary hover:underline">{product.category?.name || "N/A"}</Link></span>
            </div>
            {product.brand && (
              <div className="flex">
                <span className="w-32 bg-gray-50 px-3 py-2.5 text-gray-500 text-xs font-medium border-r border-gray-100">Brand:</span>
                <span className="px-3 py-2.5 text-xs text-gray-800">{product.brand}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10 bg-gray-50 rounded-lg p-5 md:p-7">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
        <hr className="border-gray-300 border-dashed mb-5" />
        <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
          {product.description && (
            <div className="whitespace-pre-wrap">{product.description}</div>
          )}
          <p className="text-xs text-gray-500 mt-3"><strong>রিটার্ন পলিসি:</strong> রাইটার সামনে খুলে অবশ্যই চেক করে নিবেন এবং তারপর পেমেন্ট করবেন।</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-5 font-poppins">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500 font-poppins text-sm">No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="ml-2 font-medium font-poppins text-sm">{review.name}</span>
                </div>
                <p className="text-gray-600 font-poppins text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user && (
          <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base font-semibold mb-3 font-poppins">Write a Review</h3>
            <form onSubmit={handleReview}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 font-poppins">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)}
                      className={`h-6 w-6 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}>
                      <FiStar className="h-full w-full" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1 font-poppins">Comment</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="3" className="input-field font-poppins" required />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50 font-poppins text-sm">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
