const express = require("express");
const router = express.Router();

const { createUser, getAllUsers, updateUser, deleteUser } = require("../controllers/userController");
const { protect, userSupportOnly } = require("../middleware/authMiddleware");

// User Support only
router.post("/", protect, userSupportOnly, createUser);
router.get("/", protect, userSupportOnly, getAllUsers);
router.put("/:id", protect, userSupportOnly, updateUser);
router.delete("/:id", protect, userSupportOnly, deleteUser);

module.exports = router;