const jwt = require("jsonwebtoken");
const ManagementStaff = require("../models/ManagementStaff");



// Protect middleware - ensures that a valid user is logged in
const protectAdmin = async (req, res, next) => {
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






// Role-checking middleware - allows only selected management staff roles
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Insufficient privileges",
      });
    }

    next();
  };
};




module.exports = { protectAdmin, allowRoles };