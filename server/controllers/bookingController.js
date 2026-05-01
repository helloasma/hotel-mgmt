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

    // Find any booking that overlaps with the requested check-in/check-out dates
    const conflict = await Booking.findOne({
      room: roomId,
      status: "confirmed",
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } } // Checking if dates overlap
      ],
    });

    return res.json({ success: true, available: !conflict });
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

    // Validate room and booking dates
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: "Room not found." });

    // Check if the room is available for the requested dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Check if there's any booking for the room within the same dates
    const conflict = await Booking.findOne({
      room: roomId,
      status: "confirmed",
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } } // Dates overlap
      ],
    });

    if (conflict) {
      return res.status(400).json({ success: false, message: "Room is already booked for the selected dates." });
    }

    const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000);
    const totalPrice = room.price * nights;

    // Create booking
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

    // Update the room's available rooms
    room.availableRooms -= 1; // Decrease available rooms by 1
    if (room.availableRooms === 0) {
      room.available = false; // Mark room as unavailable if no rooms left
    }
    await room.save();

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

// Get bookings for the logged-in user
const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room", "title price images")
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

    booking.status = "cancelled"; // Update booking status to cancelled
    await booking.save();  // Save the updated booking status

    // Free up the room after cancellation
    const room = await Room.findById(booking.room);
    room.availableRooms += 1; // Increase available rooms by 1
    if (room.availableRooms > 0) {
      room.available = true;  // Make room available if there are available rooms
    }
    await room.save(); // Save the updated room status

    return res.json({ success: true, data: booking });
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
  getAllBookings,
  getUserBookings,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
};