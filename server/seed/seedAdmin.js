const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: "admin@hotel.com" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      name: "System Admin",
      email: "admin@hotel.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin user created");
    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedAdmin();