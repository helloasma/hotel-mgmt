const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Async error handler wrapper for middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Protect middleware - ensures that a valid user is logged in
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Return JSON error for API requests instead of redirect
    return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
  }

  const token = authHeader.split(" ")[1];
  
  // Verify the JWT token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Fetch the user based on the decoded user ID
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    // If user doesn't exist, return error
    return res.status(401).json({ success: false, message: "User not found. Please log in again." });
  }

  req.user = user;  // Attach user to the request object
  next();
});

// Admin-only middleware - ensures only admin users can access specific routes
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  // Check if the logged-in user is an admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied: Admins only" });
  }

  next();
};

module.exports = { protect, adminOnly };