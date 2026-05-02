const express = require("express");
const {
  getAllManagementStaff,
  getManagementStaffById,
  createManagementStaff,
  updateManagementStaff,
  deleteManagementStaff,
} = require("../controllers/managementStaffController");
const { protect, chiefManagerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, chiefManagerOnly, getAllManagementStaff);
router.get("/:id", protect, chiefManagerOnly, getManagementStaffById);
router.post("/", protect, chiefManagerOnly, createManagementStaff);
router.put("/:id", protect, chiefManagerOnly, updateManagementStaff);
router.delete("/:id", protect, chiefManagerOnly, deleteManagementStaff);

module.exports = router;