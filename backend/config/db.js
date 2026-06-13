const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://junayed:JunayD%402008@ac-wtwemah-shard-00-00.pnibswx.mongodb.net:27017,ac-wtwemah-shard-00-01.pnibswx.mongodb.net:27017,ac-wtwemah-shard-00-02.pnibswx.mongodb.net:27017/hr-lifestyle?ssl=true&replicaSet=atlas-w10om1-shard-0&authSource=admin";
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};

module.exports = connectDB;
