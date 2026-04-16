const express = require("express");
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes — anyone can view rooms
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

// Admin only routes — must be logged in as admin
router.post("/", protect, adminOnly, createRoom);
router.put("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

module.exports = router;