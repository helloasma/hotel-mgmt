const express = require("express");

const {
  checkAvailability,
  createBooking,
  createAdminBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

const {
  protectAdmin,
  allowRoles,
} = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// Public: check availability
router.get("/availability", checkAvailability);

// Logged-in user: create a booking
router.post("/create", protect, createBooking);

// Logged-in user: get their own bookings
router.get("/my", protect, getUserBookings);

// Logged-in user: cancel a booking
router.put("/:id/cancel", protect, cancelBooking);

// Admin: Chief Manager and Receptionist can create a booking for a guest
router.post(
  "/admin/create",
  protectAdmin,
  allowRoles("Chief Manager", "Receptionist"),
  createAdminBooking
);

// Admin: Chief Manager and Receptionist can view all bookings
router.get(
  "/all",
  protectAdmin,
  allowRoles("Chief Manager", "Receptionist"),
  getAllBookings
);

// Admin: Chief Manager and Receptionist can update booking status
router.put(
  "/admin/:id",
  protectAdmin,
  allowRoles("Chief Manager", "Receptionist"),
  updateBookingStatus
);

// Admin: Chief Manager and Receptionist can delete booking
router.delete(
  "/admin/:id",
  protectAdmin,
  allowRoles("Chief Manager", "Receptionist"),
  deleteBooking
);

module.exports = router;