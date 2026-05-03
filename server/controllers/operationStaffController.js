const OperationStaff = require("../models/OperationStaff");

// @desc    Get all operation staff
// @route   GET /api/operation-staff
// @access  Private/Admin
const getAllOperationStaff = async (req, res, next) => {
  try {
    const staff = await OperationStaff.find({});
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get operation staff by ID
// @route   GET /api/operation-staff/:id
// @access  Private/Admin
const getOperationStaffById = async (req, res, next) => {
  try {
    const staff = await OperationStaff.findById(req.params.id);
    if (!staff) {
      res.status(404);
      throw new Error("Operation staff not found");
    }
    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create operation staff
// @route   POST /api/operation-staff
// @access  Private/Admin
const createOperationStaff = async (req, res, next) => {
  try {
    const staff = await OperationStaff.create(req.body);
    res.status(201).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update operation staff
// @route   PUT /api/operation-staff/:id
// @access  Private/Admin
const updateOperationStaff = async (req, res, next) => {
  try {
    const staff = await OperationStaff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!staff) {
      res.status(404);
      throw new Error("Operation staff not found");
    }
    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete operation staff
// @route   DELETE /api/operation-staff/:id
// @access  Private/Admin
const deleteOperationStaff = async (req, res, next) => {
  try {
    const staff = await OperationStaff.findByIdAndDelete(req.params.id);
    if (!staff) {
      res.status(404);
      throw new Error("Operation staff not found");
    }
    res.status(200).json({
      success: true,
      message: "Operation staff deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOperationStaff,
  getOperationStaffById,
  createOperationStaff,
  updateOperationStaff,
  deleteOperationStaff,
};