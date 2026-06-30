const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const makeAdmin = async (email) => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://junayed:JunayD%402008@ac-wtwemah-shard-00-00.pnibswx.mongodb.net:27017,ac-wtwemah-shard-00-01.pnibswx.mongodb.net:27017,ac-wtwemah-shard-00-02.pnibswx.mongodb.net:27017/hr-lifestyle?ssl=true&replicaSet=atlas-w10om1-shard-0&authSource=admin";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("User not found. Creating new admin user...");
      user = await User.create({
        name: "Admin",
        email: email.toLowerCase(),
        password: "admin123",
        role: "admin",
        isVerified: true,
      });
      console.log(`Admin user created: ${user.email}`);
    } else {
      user.role = "admin";
      user.isVerified = true;
      await user.save();
      console.log(`${user.email} is now ADMIN!`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

makeAdmin("Hrlifestylehrshopping@gmail.com");
