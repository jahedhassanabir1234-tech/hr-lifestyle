import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { trackSearch } from "../utils/pixel";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [categoryName, setCategoryName] = useState("");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef(null);

  // Sync from URL when navigated from Navbar
  useEffect(() => {
    const s = searchParams.get("search") || "";
    const c = searchParams.get("category") || "";
    if (s !== search) setSearch(s);
    if (c !== category) setCategory(c);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        const cats = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setCategories(cats);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products - debounced for live search
  const fetchProducts = useCallback(async (searchVal, categoryVal, pageVal, minP, maxP) => {
    setLoading(true);
    try {
      let query = `?page=${pageVal}`;
      if (searchVal) query += `&search=${encodeURIComponent(searchVal)}`;
      if (categoryVal) query += `&category=${categoryVal}`;
      if (minP) query += `&minPrice=${minP}`;
      if (maxP) query += `&maxPrice=${maxP}`;

      const { data } = await api.get(`/products${query}`);
      const d = data || {};
      setProducts(Array.isArray(d.products) ? d.products : Array.isArray(d) ? d : []);
      setPages(d.pages || 1);
      setTotal(d.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Live search with debounce - results show instantly as user types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(search, category, page, minPrice, maxPrice);
      if (search && search.length >= 2) trackSearch(search);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, category, page, minPrice, maxPrice, fetchProducts]);

  // Update category name
  useEffect(() => {
    if (category) {
      const found = categories.find((c) => c._id === category);
      setCategoryName(found?.name || "");
    } else {
      setCategoryName("");
    }
  }, [category, categories]);

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    // Update URL without re-navigating
    const params = new URLSearchParams(searchParams);
    if (val) params.set("search", val);
    else params.delete("search");
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setCategoryName("");
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = search || category || minPrice || maxPrice;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Search & Filter */}
      <div className="mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-grow relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchInput}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm font-poppins"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); setSearchParams({}); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-poppins"
          >
            <FiFilter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-100 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 font-poppins">Category</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 font-poppins">Min Price</label>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 font-poppins">Max Price</label>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <button onClick={clearFilters} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-poppins hover:bg-gray-50 transition">
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            {search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-poppins">
                Search: "{search}"
                <FiX className="h-3 w-3 cursor-pointer" onClick={() => { setSearch(""); setPage(1); setSearchParams({}); }} />
              </span>
            )}
            {category && categoryName && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-poppins">
                {categoryName}
                <FiX className="h-3 w-3 cursor-pointer" onClick={() => { setCategory(""); setCategoryName(""); setPage(1); }} />
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-poppins">
                Price: ৳{minPrice || "0"} - ৳{maxPrice || "∞"}
                <FiX className="h-3 w-3 cursor-pointer" onClick={() => { setMinPrice(""); setMaxPrice(""); setPage(1); }} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      {!loading && (
        <div className="flex flex-col items-center justify-center my-6">
          <h1 className="text-xl md:text-3xl font-poppins font-light text-gray-800 uppercase tracking-wide">
            {categoryName || (search ? `Results for "${search}"` : "All Products")}
          </h1>
          <div className="w-16 h-0.5 bg-emerald-500 mt-3"></div>
          <p className="text-gray-400 text-xs font-poppins mt-2">{total} products found</p>
        </div>
      )}

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 aspect-[3/4] rounded-lg"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg font-poppins">No products found</p>
          <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-[#222] text-white rounded-lg text-sm font-poppins hover:bg-black transition">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
            {products.map((product) => (
              <div key={product._id} className="flex flex-col h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setPage(x + 1)}
                  className={`px-4 py-2 rounded-lg transition font-poppins text-sm ${
                    page === x + 1
                      ? "bg-[#222] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
