import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const FlashSale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/products/flash-sale?page=${page}`);
        const list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : Array.isArray(data?.data) ? data.data : [];
        if (page === 1) {
          setProducts(list);
        } else {
          setProducts((prev) => [...prev, ...list]);
        }
        setHasMore(list.length > 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  return (
    <div className="font-poppins container mx-auto py-8">
      {loading ? (
        <div className="font-poppins container mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 px-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-md animate-pulse bg-gray-100 h-[230px] w-full flex flex-col justify-end p-2">
              <div className="h-6 w-20 bg-gray-300 rounded-md mt-2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="col-span-full flex flex-col items-center gap-2 font-poppins text-center text-gray-500 text-lg py-12">
          <div className="bg-neutral-50 border p-12 rounded-full">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p>No flash sale products available</p>
          <Link to="/products" className="btn-primary mt-4 inline-block font-poppins">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 items-start md:grid-cols-6 gap-4">
            {products.map((product) => (
              <div key={product._id} className="flex flex-col h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="my-6 flex justify-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="text-sm font-medium font-poppins hover:underline"
              >
                See more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FlashSale;
