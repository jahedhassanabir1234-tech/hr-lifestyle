const express = require("express");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const Product = require("./models/Product");
const Category = require("./models/Category");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

connectDB();

const app = express();

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) return false;
    return compression.filter(req, res);
  },
}));

app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "https://hr-lifestyle.web.app",
    "http://localhost:5173",
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(uploadsDir, {
  maxAge: "30d",
  etag: true,
  lastModified: true,
}));

const cacheMiddleware = (duration) => (req, res, next) => {
  res.set("Cache-Control", `public, max-age=${duration}`);
  next();
};

app.use("/api/categories", cacheMiddleware(300));
app.use("/api/products/featured", cacheMiddleware(120));
app.use("/api/products/flash-sale", cacheMiddleware(120));
app.use("/api/products/top-selling", cacheMiddleware(120));
app.use("/api/products/special", cacheMiddleware(120));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

// Batch home endpoint - single request for all homepage data
app.get("/api/home", async (req, res) => {
  try {
    const [categories, flashSaleProducts, featuredProducts] = await Promise.all([
      Category.find({}).sort({ name: 1 }).lean(),
      Product.find({ featured: true, isActive: true })
        .select("name slug price discountPrice images rating numReviews featured category")
        .populate("category", "name slug")
        .limit(8)
        .sort({ createdAt: -1 })
        .lean(),
      Product.find({ featured: true, isActive: true })
        .select("name slug price discountPrice images rating numReviews category")
        .populate("category", "name slug")
        .limit(6)
        .sort({ numReviews: -1, rating: -1 })
        .lean(),
    ]);

    const categoryProducts = {};
    if (categories.length > 0) {
      const catIds = categories.map((c) => c._id);
      const allProducts = await Product.find({
        category: { $in: catIds },
        isActive: true,
      })
        .select("name slug price discountPrice images rating numReviews stock category")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean();

      const productsByCategory = {};
      for (const product of allProducts) {
        const catId = product.category?._id?.toString() || product.category?.toString();
        if (catId) {
          if (!productsByCategory[catId]) productsByCategory[catId] = [];
          productsByCategory[catId].push(product);
        }
      }

      for (const cat of categories) {
        const prods = productsByCategory[cat._id.toString()];
        if (prods && prods.length > 0) {
          categoryProducts[cat._id] = {
            name: cat.name,
            products: prods.slice(0, 6),
          };
        }
      }
    }

    res.set("Cache-Control", "public, max-age=60");
    res.json({
      categories,
      categoryProducts,
      flashSaleProducts,
      featuredProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/bundle-products", async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .select("name slug price discountPrice images rating numReviews category")
      .populate("category", "name slug")
      .limit(6)
      .sort({ createdAt: -1 })
      .lean();
    res.set("Cache-Control", "public, max-age=120");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ message: "HR-Lifestyle API is running" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
