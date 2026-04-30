const express = require("express");
const { getDashboardStats } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get dashboard stats (bookings, users, rooms)
router.get("/dashboard", protect, adminOnly, getDashboardStats);

module.exports = router;