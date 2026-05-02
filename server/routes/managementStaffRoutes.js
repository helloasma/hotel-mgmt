const express = require("express");
const {
  getAllManagementStaff,
  getManagementStaffById,
  createManagementStaff,
  updateManagementStaff,
  deleteManagementStaff,
} = require("../controllers/managementStaffController");

const {
  protectAdmin,
  allowRoles,
} = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get(
  "/",
  protectAdmin,
  allowRoles("Chief Manager"),
  getAllManagementStaff
);

router.get(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager"),
  getManagementStaffById
);

router.post(
  "/",
  protectAdmin,
  allowRoles("Chief Manager"),
  createManagementStaff
);

router.put(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager"),
  updateManagementStaff
);

router.delete(
  "/:id",
  protectAdmin,
  allowRoles("Chief Manager"),
  deleteManagementStaff
);

module.exports = router;