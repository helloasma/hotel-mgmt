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





const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};







const updateMe = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "Management staff account not found",
      });
    }

    const staff = await ManagementStaff.findById(req.user._id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Management staff account not found",
      });
    }

    if (name !== undefined) {
      staff.fullName = name;
    }

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail !== staff.email) {
        const existingStaff = await ManagementStaff.findOne({
          email: normalizedEmail,
          _id: { $ne: staff._id },
        });

        if (existingStaff) {
          return res.status(400).json({
            success: false,
            message: "Email is already in use",
          });
        }

        if (!/^[a-zA-Z][a-zA-Z0-9_]*@lovendermgmt\.com$/i.test(normalizedEmail)) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid email format for management staff. Email must be in the format: username@lovendermgmt.com",
          });
        }

        staff.email = normalizedEmail;
      }
    }

    if (phone !== undefined) {
      staff.phone = phone;
    }

    if (password || confirmPassword) {
      if (!password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Please provide both password fields",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match",
        });
      }

      staff.password = password;
    }

    const isPasswordChange = Boolean(password || confirmPassword);

    await staff.save();

    const updatedStaff = await ManagementStaff.findById(staff._id).select("-password");

    res.status(200).json({
      success: true,
      message: isPasswordChange
        ? "Password successfully changed"
        : "Profile updated successfully",
      data: updatedStaff,
    });
  } catch (error) {
    console.error("UpdateMe error:", error.name, error.message);

    const isPasswordChange = Boolean(req.body.password || req.body.confirmPassword);

    return res.status(400).json({
      success: false,
      message: isPasswordChange
        ? "Password change failed"
        : error.message || "Update failed",
    });
  }
};




module.exports = {
  registerUser,
  loginUser,
  loginManagementStaff,
  getMe,
  updateMe,
};
