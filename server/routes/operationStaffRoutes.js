const express = require("express");
const {
  getAllOperationStaff,
  getOperationStaffById,
  createOperationStaff,
  updateOperationStaff,
  deleteOperationStaff,
} = require("../controllers/operationStaffController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getAllOperationStaff);
router.get("/:id", protect, adminOnly, getOperationStaffById);
router.post("/", protect, adminOnly, createOperationStaff);
router.put("/:id", protect, adminOnly, updateOperationStaff);
router.delete("/:id", protect, adminOnly, deleteOperationStaff);

module.exports = router;