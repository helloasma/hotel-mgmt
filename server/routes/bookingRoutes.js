const express = require("express");
const { checkAvailability, createBooking, getAllBookings, getUserBookings, cancelBooking } = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { updateBookingStatus, deleteBooking } = require("../controllers/bookingController");

const router = express.Router();

// Public: check availability
router.get("/availability", checkAvailability);

// Logged-in user: create a booking
router.post("/create", protect, createBooking);

// Logged-in user: get their own bookings
router.get("/my", protect, getUserBookings);

// Logged-in user: cancel a booking
router.put("/:id/cancel", protect, cancelBooking);

// Admin: view all bookings
router.get("/all", protect, adminOnly, getAllBookings); // Admin route to get all bookings

// Admin: update booking status
router.put("/admin/:id", protect, adminOnly, updateBookingStatus);

// Admin: delete booking
router.delete("/admin/:id", protect, adminOnly, deleteBooking);

module.exports = router;