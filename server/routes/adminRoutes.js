const express = require("express");

const { getDashboardStats } = require("../controllers/adminController");

const { protect, chiefManagerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Get dashboard stats (bookings, users, rooms, staff)
router.get("/dashboard", protect, chiefManagerOnly, getDashboardStats);

module.exports = router;
