import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileBottomNav from "./components/MobileBottomNav";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const FlashSale = lazy(() => import("./pages/FlashSale"));
const BundleProducts = lazy(() => import("./pages/BundleProducts"));
const TopSellingProducts = lazy(() => import("./pages/TopSellingProducts"));
const SpecialProducts = lazy(() => import("./pages/SpecialProducts"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Return = lazy(() => import("./pages/Return"));
const ExchangeRequest = lazy(() => import("./pages/ExchangeRequest"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-gray-200 border-t-[#E8572A] rounded-full animate-spin" />
      <p className="text-xs text-gray-400 font-poppins">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/admin/login" element={
          <Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>
        } />

        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<PageLoader />}><AdminProducts /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<PageLoader />}><AdminOrders /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<PageLoader />}><AdminCategories /></Suspense>} />
        </Route>

        <Route path="*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/flash-sale" element={<FlashSale />} />
                  <Route path="/bundle-products" element={<BundleProducts />} />
                  <Route path="/top-selling-products" element={<TopSellingProducts />} />
                  <Route path="/special-products" element={<SpecialProducts />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms-and-conditions" element={<Terms />} />
                  <Route path="/return" element={<Return />} />
                  <Route path="/exchange-request" element={<ExchangeRequest />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
