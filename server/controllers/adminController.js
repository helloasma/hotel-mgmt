
const Booking = require("../models/Booking");
const User = require("../models/User");
const Room = require("../models/Room");
const ManagementStaff = require("../models/ManagementStaff");
const OperationStaff = require("../models/OperationStaff");

const getDashboardStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalManagementStaff = await ManagementStaff.countDocuments();
    const totalOperationStaff = await OperationStaff.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        totalUsers,
        totalRooms,
        totalManagementStaff,
        totalOperationStaff,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
