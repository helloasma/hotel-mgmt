const express = require("express");
const { checkAvailability, createBooking, getAllBookings } = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public: check availability
router.get("/availability", checkAvailability);

// Public: create a booking
router.post("/create", createBooking);

// Admin: view all bookings
router.get("/all", protect, adminOnly, getAllBookings);

module.exports = router;