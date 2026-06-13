const Category = require("../models/Category");

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:slug
const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create category (Admin)
// @route   POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image || "";

    const category = await Category.create({ name, description, image });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = req.body.name || category.name;
      category.description = req.body.description || category.description;

      if (req.file) {
        category.image = `/uploads/${req.file.filename}`;
      } else if (req.body.image) {
        category.image = req.body.image;
      }

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category removed" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
