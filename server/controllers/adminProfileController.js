const ManagementStaff = require("../models/ManagementStaff");

// GET /api/admin/me
const getAdminProfile = async (req, res, next) => {
  try {
    const staff = await ManagementStaff.findById(req.user._id).select("-password");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Management staff account not found",
      });
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/me
const updateAdminProfile = async (req, res, next) => {
  try {
    const { name, fullName, email, phone } = req.body;

    const staff = await ManagementStaff.findById(req.user._id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Management staff account not found",
      });
    }

    if (name !== undefined || fullName !== undefined) {
      staff.fullName = fullName || name;
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

    await staff.save();

    const updatedStaff = await ManagementStaff.findById(staff._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedStaff,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/me/password
const updateAdminPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both password fields",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (!/(?=.*\d)(?=.*[\W_])/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number and one special character",
      });
    }

    const staff = await ManagementStaff.findById(req.user._id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Management staff account not found",
      });
    }

    staff.password = newPassword;

    await staff.save();

    const updatedStaff = await ManagementStaff.findById(staff._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Password successfully changed",
      data: updatedStaff,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
};