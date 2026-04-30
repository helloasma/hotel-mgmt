const Booking = require("../models/Booking");
const User = require("../models/User");
const Room = require("../models/Room");

const getDashboardStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        totalUsers,
        totalRooms,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};