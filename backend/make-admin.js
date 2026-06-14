const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const makeAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://junayed:JunayD%402008@ac-wtwemah-shard-00-00.pnibswx.mongodb.net:27017,ac-wtwemah-shard-00-01.pnibswx.mongodb.net:27017,ac-wtwemah-shard-00-02.pnibswx.mongodb.net:27017/hr-lifestyle?ssl=true&replicaSet=atlas-w10om1-shard-0&authSource=admin";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const user = await User.findOne({ email: "jahedhassanabir1234@gmail.com" });
    if (!user) {
      console.log("User not found! Please register first.");
      process.exit(1);
    }

    user.role = "admin";
    user.isVerified = true;
    await user.save();
    console.log(`${user.email} is now ADMIN!`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

makeAdmin();
