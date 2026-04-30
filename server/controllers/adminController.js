const User = require("../models/User");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

// GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalRooms, totalBookings, allBookings] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        Room.countDocuments(),
        Booking.countDocuments(),
        Booking.find().select("totalPrice status createdAt"),
      ]);

    const totalRevenue = allBookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const confirmedBookings = allBookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const pendingBookings = allBookings.filter(
      (b) => b.status === "pending"
    ).length;
    const cancelledBookings = allBookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    // Monthly revenue for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentBookings = allBookings.filter(
      (b) => new Date(b.createdAt) >= sixMonthsAgo && b.status !== "cancelled"
    );

    const monthlyRevenue = {};
    recentBookings.forEach((b) => {
      const month = new Date(b.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + b.totalPrice;
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRooms,
        totalBookings,
        totalRevenue,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Fetch their bookings too
    const bookings = await Booking.find({ user: req.params.id })
      .populate("room", "title price images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { user, bookings },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.role === "admin") {
      res.status(400);
      throw new Error("Cannot delete an admin account");
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/bookings
const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("room", "title price images type")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status value");
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("room", "title price")
      .populate("user", "name email");

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllBookingsAdmin,
  updateBookingStatus,
};
