const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ManagementStaff = require("../models/ManagementStaff");

// Protect middleware - ensures that a valid user is logged in
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Redirect to login if not authenticated
      return res.redirect("/admin-login");
    }

    const token = authHeader.split(" ")[1];
    
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    const managementRoles = ["Chief Manager", "Manager", "User support", "Receptionist"];
    if (managementRoles.includes(decoded.role)) {
      user = await ManagementStaff.findById(decoded.userId).select("-password");
    } else {
      user = await User.findById(decoded.userId).select("-password");
    }

    if (!user) {
      // If user doesn't exist, redirect to login
      return res.redirect("/admin-login");
    }

    req.user = user;  // Attach user to the request object
    next();
  } catch (error) {
    console.log(error);
    // If token verification fails, redirect to login
    return res.redirect("/admin-login");
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

module.exports = { protect, adminOnly };