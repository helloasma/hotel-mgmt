const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

    // Fetch the user based on the decoded user ID
    const user = await User.findById(decoded.userId).select("-password");

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