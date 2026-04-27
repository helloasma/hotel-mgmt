const Booking = require("../models/Booking");
const Room = require("../models/Room");

// Check availability for a room on given dates
const checkAvailability = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: "roomId, checkIn, and checkOut are required." });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ success: false, message: "Check-out must be after check-in." });
    }

    const conflict = await Booking.findOne({
      room: roomId,
      status: "confirmed",
      $or: [{ checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }],
    });

    return res.json({ success: true, available: !conflict });
  } catch (error) {
    next(error);
  }
};

// Create a new booking
const createBooking = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, adults, children, firstName, lastName, email, phone, paymentMethod, specialRequest } = req.body;

    if (!roomId || !checkIn || !checkOut || !firstName || !lastName || !email || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required booking fields." });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ success: false, message: "Check-out must be after check-in." });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: "Room not found." });

    const conflict = await Booking.findOne({
      room: roomId,
      status: "confirmed",
      $or: [{ checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }],
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `This room is already booked from ${conflict.checkIn.toDateString()} to ${conflict.checkOut.toDateString()}. Please choose different dates.`,
      });
    }

    const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000);
    const totalPrice = room.price * nights;

    const booking = await Booking.create({
      room: roomId, checkIn: checkInDate, checkOut: checkOutDate,
      adults: adults || 1, children: children || 0,
      firstName, lastName, email, phone, paymentMethod, totalPrice, specialRequest,
    });

    const populated = await booking.populate("room", "title price images");
    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// Get all bookings (admin)
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("room", "title price").sort({ createdAt: -1 });
    return res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkAvailability, createBooking, getAllBookings };