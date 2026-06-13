import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const SpecialProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products/special");
        setProducts(Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-poppins">Special Products</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-md animate-pulse bg-gray-100 h-[230px] w-full flex flex-col justify-end p-2">
              <div className="h-4 w-20 bg-gray-300 rounded-md mt-2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg font-poppins">No special products available</p>
          <Link to="/products" className="btn-primary mt-4 inline-block font-poppins">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {products.map((product) => (
            <div key={product._id} className="flex flex-col h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialProducts;
