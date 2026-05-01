const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, "Attachment filename is required"],
      trim: true,
    },
    fileType: {
      type: String,
      required: [true, "Attachment file type is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return ["jpg", "jpeg", "png", "pdf", "doc", "docx"].includes(value.toLowerCase());
        },
        message: "Attachments must be JPG, PNG, PDF, DOC, or DOCX",
      },
    },
    size: {
      type: Number,
      required: [true, "Attachment size is required"],
      validate: {
        validator: function (value) {
          return value >= 0 && value <= 5 * 1024 * 1024;
        },
        message: "Attachment size must be 5MB or less",
      },
    },
    url: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const contactpageMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "You can attach up to 5 files",
      },
    },
  },
  {
    timestamps: true,
    collection: "contactpage_messages",
  }
);

module.exports = mongoose.model("ContactpageMessage", contactpageMessageSchema);