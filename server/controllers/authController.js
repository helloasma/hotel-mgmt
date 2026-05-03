const User = require("../models/User");
const ManagementStaff = require("../models/ManagementStaff");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, responsibility } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    const userRole = role || "user";
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: userRole,
      responsibility:
        userRole === "admin" ? responsibility || "New Staff" : undefined,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        responsibility: user.responsibility,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};



const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        responsibility: user.responsibility,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    next(error);
  }
};

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");



//Admin Login
const loginManagementStaff = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const escapedEmail = escapeRegExp(email.trim());
    const staff = await ManagementStaff.findOne({
      email: { $regex: `^${escapedEmail}$`, $options: "i" },
    });

    if (!staff) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await staff.matchPassword(password);

    if (!passwordMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: staff._id,
        fullName: staff.fullName,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        token: generateToken(staff._id, staff.role),
      },
    });
  } catch (error) {
    next(error);
  }
};







module.exports = {
  registerUser,
  loginUser,
  loginManagementStaff,
};
