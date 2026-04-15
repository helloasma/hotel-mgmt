const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized, token failed"));
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(new Error("Not authorized"));
  }

  if (req.user.role !== "admin") {
    res.status(403);
    return next(new Error("Access denied: admin only"));
  }

  next();
};

module.exports = { protect, adminOnly };