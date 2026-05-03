const express = require("express");
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const {
  protectAdmin,
  allowRoles,
} = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// Public routes — anyone can view rooms
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

// Admin routes — Chief Manager and Manager only
router.post(
  "/",
  protectAdmin,
  allowRoles("Chief Manager", "Manager"),
  createRoom
);

router.put(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager", "Manager"),
  updateRoom
);

router.delete(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager", "Manager"),
  deleteRoom
);

module.exports = router;