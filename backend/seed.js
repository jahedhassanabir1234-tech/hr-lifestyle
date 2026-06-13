const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@hrlifestyle.com",
      password: "admin123",
      role: "admin",
      phone: "+8801712345678",
      address: {
        street: "123 Admin Street",
        city: "Dhaka",
        state: "Dhaka",
        zipCode: "1000",
      },
    });

    // Create test user
    const user = await User.create({
      name: "Test User",
      email: "user@hrlifestyle.com",
      password: "user123",
      phone: "+8801812345678",
      address: {
        street: "456 User Lane",
        city: "Chittagong",
        state: "Chittagong",
        zipCode: "4000",
      },
    });

    console.log("Users created!");

    // Create categories
    const categories = await Category.insertMany([
      { name: "Fashion", slug: "fashion", description: "Clothing and accessories" },
      { name: "Electronics", slug: "electronics", description: "Gadgets and devices" },
      { name: "Lifestyle", slug: "lifestyle", description: "Home and lifestyle products" },
      { name: "Sports", slug: "sports", description: "Sports and fitness equipment" },
    ]);

    console.log("Categories created!");

    // Create products
    const products = await Product.insertMany([
      {
        name: "Premium Cotton T-Shirt",
        slug: "premium-cotton-t-shirt",
        description:
          "High-quality 100% cotton t-shirt. Comfortable fit, perfect for everyday wear. Available in multiple colors.",
        price: 599,
        discountPrice: 499,
        category: categories[0]._id,
        brand: "HR Fashion",
        stock: 50,
        featured: true,
        rating: 4.5,
        numReviews: 12,
        images: ["/uploads/tshirt.jpg"],
      },
      {
        name: "Wireless Bluetooth Headphones",
        slug: "wireless-bluetooth-headphones",
        description:
          "Premium wireless headphones with active noise cancellation. 30-hour battery life, premium sound quality.",
        price: 2999,
        discountPrice: 2499,
        category: categories[1]._id,
        brand: "HR Audio",
        stock: 25,
        featured: true,
        rating: 4.7,
        numReviews: 8,
        images: ["/uploads/headphones.jpg"],
      },
      {
        name: "Smart Watch Pro",
        slug: "smart-watch-pro",
        description:
          "Feature-packed smartwatch with health monitoring, GPS, and 7-day battery life. Water resistant.",
        price: 4999,
        category: categories[1]._id,
        brand: "HR Tech",
        stock: 15,
        featured: true,
        rating: 4.3,
        numReviews: 20,
        images: ["/uploads/watch.jpg"],
      },
      {
        name: "Designer Sunglasses",
        slug: "designer-sunglasses",
        description:
          "UV400 protection designer sunglasses. Lightweight frame, polarized lenses.",
        price: 1299,
        discountPrice: 999,
        category: categories[0]._id,
        brand: "HR Fashion",
        stock: 30,
        featured: true,
        rating: 4.1,
        numReviews: 15,
        images: ["/uploads/sunglasses.jpg"],
      },
      {
        name: "Yoga Mat Premium",
        slug: "yoga-mat-premium",
        description:
          "Non-slip premium yoga mat. 6mm thick, eco-friendly material. Perfect for yoga and fitness.",
        price: 899,
        category: categories[3]._id,
        brand: "HR Sports",
        stock: 40,
        featured: true,
        rating: 4.6,
        numReviews: 10,
        images: ["/uploads/yogamat.jpg"],
      },
      {
        name: "Ceramic Coffee Mug Set",
        slug: "ceramic-coffee-mug-set",
        description:
          "Set of 4 premium ceramic coffee mugs. Dishwasher safe, modern design.",
        price: 799,
        discountPrice: 649,
        category: categories[2]._id,
        brand: "HR Lifestyle",
        stock: 35,
        featured: true,
        rating: 4.4,
        numReviews: 18,
        images: ["/uploads/mugs.jpg"],
      },
      {
        name: "Running Shoes",
        slug: "running-shoes",
        description:
          "Lightweight running shoes with memory foam insole. Breathable mesh upper.",
        price: 2499,
        discountPrice: 1999,
        category: categories[3]._id,
        brand: "HR Sports",
        stock: 20,
        featured: true,
        rating: 4.8,
        numReviews: 25,
        images: ["/uploads/shoes.jpg"],
      },
      {
        name: "Laptop Backpack",
        slug: "laptop-backpack",
        description:
          "Water-resistant laptop backpack with USB charging port. Fits up to 15.6 inch laptop.",
        price: 1499,
        category: categories[0]._id,
        brand: "HR Fashion",
        stock: 28,
        featured: true,
        rating: 4.2,
        numReviews: 14,
        images: ["/uploads/backpack.jpg"],
      },
    ]);

    console.log("Products created!");
    console.log("\n--- Seed Data Created Successfully! ---");
    console.log("Admin Login: admin@hrlifestyle.com / admin123");
    console.log("User Login: user@hrlifestyle.com / user123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
