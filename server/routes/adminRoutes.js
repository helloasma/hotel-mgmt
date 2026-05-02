const express = require("express");

const { getDashboardStats } = require("../controllers/adminController");

const {
  protectAdmin,
  allowRoles,
} = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// Visual Summary stats — Chief Manager only
router.get(
  "/dashboard",
  protectAdmin,
  allowRoles("Chief Manager"),
  getDashboardStats
);

module.exports = router;