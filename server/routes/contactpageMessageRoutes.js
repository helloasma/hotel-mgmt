const express = require("express");
const {
  getAllContactMessages,
  getContactMessageById,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
} = require("../controllers/contactpageMessageController");
const { protect, userSupportOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, userSupportOnly, getAllContactMessages);
router.get("/:id", protect, userSupportOnly, getContactMessageById);
router.post("/", createContactMessage);
router.put("/:id", protect, userSupportOnly, updateContactMessage);
router.delete("/:id", protect, userSupportOnly, deleteContactMessage);

module.exports = router;