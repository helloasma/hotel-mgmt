const ContactpageMessage = require("../models/ContactpageMessage");

// @desc    Get all contact page messages
// @route   GET /api/contact-messages
// @access  Private/Admin
const getAllContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactpageMessage.find({});
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact message by ID
// @route   GET /api/contact-messages/:id
// @access  Private/Admin
const getContactMessageById = async (req, res, next) => {
  try {
    const message = await ContactpageMessage.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error("Contact message not found");
    }
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create contact message
// @route   POST /api/contact-messages
// @access  Private/Admin
const createContactMessage = async (req, res, next) => {
  try {
    const message = await ContactpageMessage.create(req.body);
    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message
// @route   PUT /api/contact-messages/:id
// @access  Private/Admin
const updateContactMessage = async (req, res, next) => {
  try {
    const message = await ContactpageMessage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!message) {
      res.status(404);
      throw new Error("Contact message not found");
    }
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact-messages/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res, next) => {
  try {
    const message = await ContactpageMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error("Contact message not found");
    }
    res.status(200).json({
      success: true,
      message: "Contact message deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContactMessages,
  getContactMessageById,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
};