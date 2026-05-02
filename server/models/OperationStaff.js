const mongoose = require("mongoose");

const operationStaffSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
      validate: {
        validator: function (value) {
          if (!value) return false;
          const words = value.trim().split(/\s+/);
          return words.length >= 2 && words.every((word) => word.length >= 2);
        },
        message: "Full Name must contain at least two words",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z][a-zA-Z0-9_]*@[a-zA-Z]+\.[a-zA-Z]+$/i.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (value) {
          return /^0\d{9}$/.test(value);
        },
        message: "Phone number must be exactly 10 digits and start with 0",
      },
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: [
          "Housekeeper",
          "Maintenance",
          "Guest Service",
          "Groundskeeper",
          "Activities Coordinator",
        ],
        message: "Role must be one of the allowed operation staff categories",
      },
    },
  },
  {
    timestamps: true,
    collection: "operation_staff",
  }
);

module.exports = mongoose.model("OperationStaff", operationStaffSchema);