const express = require("express");
const {
  getAllManagementStaff,
  getManagementStaffById,
  createManagementStaff,
  updateManagementStaff,
  deleteManagementStaff,
} = require("../controllers/managementStaffController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getAllManagementStaff);
router.get("/:id", protect, adminOnly, getManagementStaffById);
router.post("/", protect, adminOnly, createManagementStaff);
router.put("/:id", protect, adminOnly, updateManagementStaff);
router.delete("/:id", protect, adminOnly, deleteManagementStaff);

module.exports = router;