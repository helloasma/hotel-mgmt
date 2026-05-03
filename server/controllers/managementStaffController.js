const ManagementStaff = require("../models/ManagementStaff");

// @desc    Get all management staff
// @route   GET /api/management-staff
// @access  Private/Admin
const getAllManagementStaff = async (req, res, next) => {
  try {
    const staff = await ManagementStaff.find({}).select("-password");

    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get management staff by ID
// @route   GET /api/management-staff/:id
// @access  Private/Admin
const getManagementStaffById = async (req, res, next) => {
  try {
    const staff = await ManagementStaff.findById(req.params.id).select("-password");

    if (!staff) {
      res.status(404);
      throw new Error("Management staff not found");
    }

    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create management staff
// @route   POST /api/management-staff
// @access  Private/Admin
const createManagementStaff = async (req, res, next) => {
  try {
    const staff = await ManagementStaff.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        _id: staff._id,
        fullName: staff.fullName,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        createdAt: staff.createdAt,
        updatedAt: staff.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update management staff
// @route   PUT /api/management-staff/:id
// @access  Private/Admin
const updateManagementStaff = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    const staff = await ManagementStaff.findById(req.params.id);

    if (!staff) {
      res.status(404);
      throw new Error("Management staff not found");
    }

    if (fullName !== undefined) staff.fullName = fullName;
    if (email !== undefined) staff.email = email;
    if (password !== undefined) staff.password = password;
    if (phone !== undefined) staff.phone = phone;
    if (role !== undefined) staff.role = role;

    const updatedStaff = await staff.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedStaff._id,
        fullName: updatedStaff.fullName,
        email: updatedStaff.email,
        phone: updatedStaff.phone,
        role: updatedStaff.role,
        createdAt: updatedStaff.createdAt,
        updatedAt: updatedStaff.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete management staff
// @route   DELETE /api/management-staff/:id
// @access  Private/Admin
const deleteManagementStaff = async (req, res, next) => {
  try {
    const staff = await ManagementStaff.findByIdAndDelete(req.params.id);

    if (!staff) {
      res.status(404);
      throw new Error("Management staff not found");
    }

    res.status(200).json({
      success: true,
      message: "Management staff deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllManagementStaff,
  getManagementStaffById,
  createManagementStaff,
  updateManagementStaff,
  deleteManagementStaff,
};