const express = require("express");

const { getDashboardStats } = require("../controllers/adminController");

const {
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
} = require("../controllers/adminProfileController");

const {
  protectAdmin,
  allowRoles,
} = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// Admin My Account — all management staff roles
router.get(
  "/me",
  protectAdmin,
  allowRoles("Chief Manager", "Manager", "Receptionist", "User support"),
  getAdminProfile
);

router.put(
  "/me",
  protectAdmin,
  allowRoles("Chief Manager", "Manager", "Receptionist", "User support"),
  updateAdminProfile
);

router.put(
  "/me/password",
  protectAdmin,
  allowRoles("Chief Manager", "Manager", "Receptionist", "User support"),
  updateAdminPassword
);

// Visual Summary stats — Chief Manager only
router.get(
  "/dashboard",
  protectAdmin,
  allowRoles("Chief Manager"),
  getDashboardStats
);

module.exports = router;