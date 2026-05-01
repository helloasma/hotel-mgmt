const express = require("express");
const {
  getStats,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllBookingsAdmin,
  updateBookingStatus,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(protect, adminOnly);

// Stats dashboard
router.get("/stats", getStats);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

// Booking management
router.get("/bookings", getAllBookingsAdmin);
router.put("/bookings/:id/status", updateBookingStatus);

module.exports = router;
