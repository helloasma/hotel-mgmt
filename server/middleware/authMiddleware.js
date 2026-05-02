const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ManagementStaff = require("../models/ManagementStaff");

// Protect middleware - ensures that a valid user is logged in
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const managementRoles = [
      "Chief Manager",
      "Manager",
      "User support",
      "Receptionist",
    ];

    if (!managementRoles.includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: admin side is for management staff only",
      });
    }

    const user = await ManagementStaff.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Management staff account not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};




// Admin-only middleware - ensures only admin or management staff can access specific routes
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  const allowedRoles = ["admin", "Chief Manager", "Manager", "Receptionist", "User support"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied: Insufficient privileges" });
  }

  next();
};

// Chief Manager-only middleware - ensures only the Chief Manager can access specific routes
const chiefManagerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  if (req.user.role !== "Chief Manager") {
    return res.status(403).json({ success: false, message: "Access denied: Chief Manager only" });
  }

  next();
};

// User Support middleware - ensures only Chief Manager or User support can access specific routes
const userSupportOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  const allowedRoles = ["Chief Manager", "User support"];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Access denied: Insufficient privileges" });
  }

  next();
};

module.exports = { protect, adminOnly, chiefManagerOnly, userSupportOnly };