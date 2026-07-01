import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import {
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { getImageUrl } from "../utils/getImageUrl";
import {
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
  FiChevronUp,
} from "react-icons/fi";

const ScrollToTopButton = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollProgress(
        (window.pageYOffset / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const r = 18;
  const circumference = 2 * Math.PI * r;

  if (scrollProgress <= 0) return null;

  return (
    <div className="fixed bottom-14 z-50 right-4">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="relative w-10 h-10 flex items-center justify-center rounded-full"
        aria-label="Scroll to top"
      >
        <svg className="absolute inset-0" width="86" height="86" viewBox="4 4 86 86" xmlns="http://www.w3.org/2000/svg">
          <circle className="text-gray-300" stroke="currentColor" strokeWidth="2" fill="transparent" r={r} cx="24" cy="24" />
          <circle className="text-black" stroke="currentColor" strokeWidth="2" fill="transparent" r={r} cx="24" cy="24"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (scrollProgress / 100) * circumference}
            style={{ transition: "stroke-dashoffset 0.2s ease-out" }}
          />
        </svg>
        <FiChevronUp className="text-black text-sm font-semibold" />
      </button>
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden animate-pulse">
    <div className="w-full aspect-[3/4] bg-gray-200" />
    <div className="p-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-3" />
      <div className="h-9 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

const CategorySectionSkeleton = () => (
  <section className="mb-12">
    <div className="flex flex-col items-center justify-center my-8">
      <div className="h-7 bg-gray-200 rounded w-40 mb-2 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-16 mt-1 animate-pulse" />
      <div className="w-16 h-0.5 bg-gray-200 mt-3 animate-pulse" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  </section>
);

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    let interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const slides = [
    { image: "/banners/banner1.jpg" },
    { image: "/banners/banner2.jpg" },
    { image: "/banners/banner3.jpg" },
    { image: "/banners/banner4.jpg" },
    { image: "/banners/banner5.jpg" },
  ];

  const features = [
    { icon: <FiTruck size={28} />, title: "Reliable Delivery", description: "Safe and fast home delivery across the country" },
    { icon: <FiShield size={28} />, title: "Secure Payment", description: "Supports all major mobile payment methods" },
    { icon: <FiRefreshCw size={28} />, title: "Easy Return Process", description: "Return and exchange available under certain conditions" },
    { icon: <FiHeadphones size={28} />, title: "24/7 Customer Support", description: "Contact us for help with any questions" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/home");
        setCategories(data.categories || []);
        setCategoryProducts(data.categoryProducts || {});
        setFlashSaleProducts(data.flashSaleProducts || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setCatLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white">
      <ScrollToTopButton />

      {/* Hero Slider */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="embla bg-white overflow-hidden drop-shadow-sm select-none"
      >
        <div className="relative group h-[200px] md:h-[65vh] lg:h-[76vh] w-full">
          <div className="embla__viewport overflow-hidden w-full h-full cursor-grab" ref={emblaRef}>
            <div className="embla__container flex h-full">
              {slides.map((slide, index) => (
                <div key={index} className="embla__slide flex-[0_0_100%] relative h-full w-full">
                  <img
                    src={slide.image}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute z-10 top-1/2 left-2 -translate-y-1/2 transition-all opacity-0 group-hover:opacity-100">
            <button onClick={scrollPrev} disabled={prevBtnDisabled}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md transition disabled:opacity-50"
            >
              <HiChevronLeft size={30} />
            </button>
          </div>
          <div className="absolute z-10 top-1/2 right-2 -translate-y-1/2 transition-all opacity-0 group-hover:opacity-100">
            <button onClick={scrollNext} disabled={nextBtnDisabled}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md transition disabled:opacity-50"
            >
              <HiChevronRight size={30} />
            </button>
          </div>

          {scrollSnaps.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 items-center">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`rounded-full transition ${
                    selectedIndex === index
                      ? "w-2 h-2 bg-[#E8572A]"
                      : "w-2 h-2 bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Top Categories */}
      {loading ? (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 my-8">
          <div className="flex items-center justify-center w-full my-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <div className="h-6 bg-gray-200 rounded w-32 mx-4 animate-pulse" />
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      ) : categories.length > 0 && (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 my-8">
          <div className="flex items-center justify-center w-full my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <h1 className="text-lg md:text-3xl font-poppins px-4 font-light text-gray-800">Top Categories</h1>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
            {categories.slice(0, 7).map((category) => (
              <TopCategoryCard key={category._id} category={category} />
            ))}
          </div>
        </div>
      )}

      {/* Category-wise Product Sections */}
      {catLoading ? (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <CategorySectionSkeleton key={i} />
          ))}
        </div>
      ) : Object.keys(categoryProducts).length > 0 && (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
          {categories.map((category) => {
            const catData = categoryProducts[category._id];
            if (!catData) return null;
            return (
              <section key={category._id} className="mb-12">
                <div className="flex flex-col items-center justify-center my-8">
                  <h2 className="text-xl md:text-3xl font-poppins font-light text-gray-800 uppercase tracking-wide">
                    {catData.name}
                  </h2>
                  <Link
                    to={`/products?category=${category._id}`}
                    className="text-xs md:text-sm font-poppins text-gray-500 hover:text-gray-800 mt-1 tracking-widest uppercase"
                  >
                    VIEW ALL
                  </Link>
                  <div className="w-16 h-0.5 bg-emerald-500 mt-3"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
                  {catData.products.map((product) => (
                    <div key={product._id} className="flex flex-col h-full">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Flash Sale Section */}
      {flashSaleProducts.length > 0 && (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 mb-12">
          <div className="flex flex-col items-center justify-center my-8">
            <h2 className="text-xl md:text-3xl font-poppins font-light text-gray-800 uppercase tracking-wide">
              Flash Sale
            </h2>
            <Link
              to="/flash-sale"
              className="text-xs md:text-sm font-poppins text-gray-500 hover:text-gray-800 mt-1 tracking-widest uppercase"
            >
              VIEW ALL
            </Link>
            <div className="w-16 h-0.5 bg-emerald-500 mt-3"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
            {flashSaleProducts.slice(0, 6).map((product) => (
              <div key={product._id} className="flex flex-col h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-600">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-800 font-poppins">{feature.title}</h3>
              <p className="text-xs text-gray-500 mt-2 font-poppins">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TopCategoryCard = ({ category }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/products?category=${category._id}`}
      className="relative w-full aspect-[3/4] rounded-lg overflow-hidden group cursor-pointer"
    >
      {imgError || !category.image ? (
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-sm font-poppins font-medium">{category.name}</span>
        </div>
      ) : (
        <img
          src={getImageUrl(category.image)}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgError(true)}
          loading="lazy"
          decoding="async"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-5 px-3">
        <h3 className="text-white text-sm md:text-base font-bold font-poppins text-center mb-2 drop-shadow-lg leading-tight">
          {category.name}
        </h3>
        <span className="px-4 py-1.5 bg-primary text-black text-xs font-bold font-poppins rounded-sm hover:bg-white transition-colors duration-200">
          See All
        </span>
      </div>
    </Link>
  );
};

export default Home;
