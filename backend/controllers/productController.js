const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    let query = { isActive: true };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      const regex = { $regex: req.query.search, $options: "i" };
      query.$or = [
        { name: regex },
        { description: regex },
        { brand: regex },
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .select("name slug price discountPrice images rating numReviews stock category brand")
      .populate("category", "name slug")
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (Admin - includes inactive)
// @route   GET /api/products/admin/all
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .select("name slug price discountPrice images rating numReviews stock category brand isActive featured sizes sizeChart")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle product active/inactive
// @route   PATCH /api/products/:id/toggle-active
const toggleProductActive = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isActive = !product.isActive;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .select("name slug price discountPrice images rating numReviews category")
      .populate("category", "name slug")
      .limit(8)
      .sort({ createdAt: -1 })
      .lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top selling products
// @route   GET /api/products/top-selling
const getTopSellingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select("name slug price discountPrice images rating numReviews category")
      .populate("category", "name slug")
      .limit(6)
      .sort({ numReviews: -1, rating: -1 })
      .lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get flash sale products
// @route   GET /api/products/flash-sale
const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .select("name slug price discountPrice images rating numReviews category")
      .populate("category", "name slug")
      .limit(10)
      .sort({ createdAt: -1 })
      .lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get special products
// @route   GET /api/products/special
const getSpecialProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .select("name slug price discountPrice images rating numReviews category")
      .populate("category", "name slug")
      .limit(6)
      .sort({ createdAt: -1 })
      .lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:slug
const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("reviews.user", "name avatar");

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      stock,
      featured,
      sizes,
      sizeChart,
      images,
    } = req.body;

    const productImages = Array.isArray(images) ? images : [];

    let parsedSizes = Array.isArray(sizes) ? sizes : [];
    let parsedSizeChart = Array.isArray(sizeChart) ? sizeChart : [];

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      images: productImages,
      category,
      brand,
      stock: Number(stock),
      featured: featured === "true" || featured === true,
      sizes: parsedSizes,
      sizeChart: parsedSizeChart,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price ? Number(req.body.price) : product.price;
      product.discountPrice =
        req.body.discountPrice !== undefined
          ? Number(req.body.discountPrice)
          : product.discountPrice;
      product.category = req.body.category || product.category;
      product.brand = req.body.brand || product.brand;
      product.stock =
        req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
      product.featured =
        req.body.featured !== undefined
          ? req.body.featured === "true" || req.body.featured === true
          : product.featured;
      product.isActive =
        req.body.isActive !== undefined
          ? req.body.isActive === "true" || req.body.isActive === true
          : product.isActive;

      if (Array.isArray(req.body.sizes)) {
        product.sizes = req.body.sizes;
      }
      if (Array.isArray(req.body.sizeChart)) {
        product.sizeChart = req.body.sizeChart;
      }

      if (Array.isArray(req.body.images)) {
        product.images = req.body.images;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res
          .status(400)
          .json({ message: "Product already reviewed" });
      }

      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getAdminProducts,
  toggleProductActive,
  getFeaturedProducts,
  getTopSellingProducts,
  getFlashSaleProducts,
  getSpecialProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
};
