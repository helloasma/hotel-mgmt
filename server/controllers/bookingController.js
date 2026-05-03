const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");

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

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found." });
    }

    // Count confirmed bookings that overlap with the requested date range
    const bookedCount = await Booking.countDocuments({
      room: roomId,
      status: "confirmed",
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    const remainingUnits = room.totalRooms - bookedCount;

    return res.json({
      success: true,
      available: bookedCount < room.totalRooms,
      remainingUnits,
      totalUnits: room.totalRooms,
    });
  } catch (error) {
    next(error);
  }
};


// create booking
const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      adults,
      children,
      firstName,
      lastName,
      email,
      phone,
      paymentMethod,
      specialRequest,
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: "Room not found." });

    // Capacity check
    const totalGuests = (adults || 1) + (children || 0);
    if (totalGuests > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `This room has a maximum capacity of ${room.capacity} guest${room.capacity !== 1 ? "s" : ""}.`,
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Count confirmed bookings that overlap with the requested date range
    const bookedCount = await Booking.countDocuments({
      room: roomId,
      status: "confirmed",
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (bookedCount >= room.totalRooms) {
      return res.status(400).json({
        success: false,
        message: "Please select another date. This room is fully booked for the selected dates.",
      });
    }

    const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000);
    const totalPrice = room.price * nights;

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: adults || 1,
      children: children || 0,
      firstName,
      lastName,
      email,
      phone,
      paymentMethod,
      totalPrice,
      specialRequest,
    });

    // Populate room details before returning
    const populatedBooking = await Booking.findById(booking._id).populate("room", "title price images");

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    console.error("Booking creation error:", error);
    next(error);
  }
};



// ADMIN: create a booking on behalf of a guest user
const createAdminBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      adults,
      children,
      firstName,
      lastName,
      email,
      phone,
      paymentMethod,
      specialRequest,
    } = req.body;

    const guestUser = await User.findOne({ email: email?.trim().toLowerCase() });
    if (!guestUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found." });
    }

    const totalGuests = (adults || 1) + (children || 0);
    if (totalGuests > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `This room has a maximum capacity of ${room.capacity} guest${room.capacity !== 1 ? "s" : ""}.`,
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const bookedCount = await Booking.countDocuments({
      room: roomId,
      status: "confirmed",
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (bookedCount >= room.totalRooms) {
      return res.status(400).json({
        success: false,
        message: "This room is fully booked for the selected dates.",
      });
    }

    const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000);
    const totalPrice = room.price * nights;

    const booking = await Booking.create({
      user: guestUser._id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: adults || 1,
      children: children || 0,
      firstName,
      lastName,
      email: email.trim().toLowerCase(),
      phone,
      paymentMethod,
      totalPrice,
      specialRequest,
    });

    const populatedBooking = await Booking.findById(booking._id).populate("room", "title price images");
    return res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    next(error);
  }
};


// Get all bookings (admin)
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "room",
        select: "title price images"
      })
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// Get bookings for the logged-in user
const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "room",
        select: "title price images"
      })
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// Cancel a booking (owner only)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized." });

    booking.status = "cancelled";
    await booking.save();

    // Populate room details before returning
    const populatedBooking = await Booking.findById(booking._id).populate("room", "title price images");

    return res.json({ success: true, data: populatedBooking });
  } catch (error) {
    next(error);
  }
};


// ADMIN: update booking status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    booking.status = status || booking.status;

    const updated = await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking updated",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: delete booking
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkAvailability,
  createBooking,
  createAdminBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
};
