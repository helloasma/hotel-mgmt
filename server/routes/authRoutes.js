const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const handleValidationErrors = require("../middleware/validateMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("phone").optional({ checkFalsy: true }).trim(),
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

const { adminOnly } = require("../middleware/authMiddleware");

router.get("/admin-test", protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
  });
});

router.get("/me", protect, getMe);

module.exports = router;