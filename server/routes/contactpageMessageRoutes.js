const express = require("express");
const {
  getAllContactMessages,
  getContactMessageById,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
} = require("../controllers/contactpageMessageController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getAllContactMessages);
router.get("/:id", protect, adminOnly, getContactMessageById);
router.post("/", createContactMessage);
router.put("/:id", protect, adminOnly, updateContactMessage);
router.delete("/:id", protect, adminOnly, deleteContactMessage);

module.exports = router;