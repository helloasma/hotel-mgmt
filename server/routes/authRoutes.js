const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  loginManagementStaff,
  getMe,
  updateMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const handleValidationErrors = require("../middleware/validateMiddleware");
const ManagementStaff = require("../models/ManagementStaff");

const router = express.Router();

// Temporary debug route
router.get("/debug/staff", async (req, res) => {
  try {
    const staff = await ManagementStaff.find({});
    res.json({
      count: staff.length,
      staff: staff.map(s => ({ 
        fullName: s.fullName, 
        email: s.email, 
        role: s.role,
        hasPassword: !!s.password
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("responsibility")
      .optional()
      .trim()
      .isIn(["Manager", "Receptionist", "Housekeeper", "Maintenance", "New Staff"])
      .withMessage("Invalid responsibility"),
    handleValidationErrors,
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    handleValidationErrors,
  ],
  loginUser
);

router.post(
  "/management-login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    handleValidationErrors,
  ],
  loginManagementStaff
);

const { adminOnly } = require("../middleware/authMiddleware");

router.get("/admin-test", protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
  });
});

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

module.exports = router;