const express = require("express");

const {
  getAllContactMessages,
  getContactMessageById,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
} = require("../controllers/contactpageMessageController");

const {
  protectAdmin,
  allowRoles,
} = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// Admin side: Chief Manager and User support only
router.get(
  "/",
  protectAdmin,
  allowRoles("Chief Manager", "User support"),
  getAllContactMessages
);

router.get(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager", "User support"),
  getContactMessageById
);

// Public website contact form
router.post("/", createContactMessage);

router.put(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager", "User support"),
  updateContactMessage
);

router.delete(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager", "User support"),
  deleteContactMessage
);

module.exports = router;