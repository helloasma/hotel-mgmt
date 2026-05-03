const Room = require("../models/Room");

// GET /api/rooms — get all rooms
const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ available: true });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/rooms/:id — get single room
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/rooms — create room (admin only)
const createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};


// PUT /api/rooms/:id — update room (admin only)
const updateRoom = async (req, res, next) => {
  try {
    // Find and update the room
    const room = await Room.findByIdAndUpdate(
      req.params.id,   // Find by room ID
      req.body,         // Update data from request body
      { new: true, runValidators: true }  // Get updated document with validation
    );

    // Check if the room exists
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Ensure available field updates based on availableRooms
    if (room.availableRooms === 0) {
      room.available = false;  // If availableRooms is 0, set available to false
    } else {
      room.available = true;  // Otherwise, set available to true
    }

    // Save the room after making the necessary changes
    await room.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Room updated successfully",  // Success message
      data: room,  // Return the updated room data
    });
  } catch (error) {
    next(error);  // If an error occurs, pass it to the error handler
  }
};


// DELETE /api/rooms/:id — delete room (admin only)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


// GET /api/rooms/admin/all — get all rooms for admin dashboard
const getAllRoomsForAdmin = async (req, res, next) => {
  try {
    const rooms = await Room.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllRooms,
  getAllRoomsForAdmin,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};