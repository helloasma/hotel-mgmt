const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const managementStaffSchema = new mongoose.Schema(
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
          return /^[a-zA-Z][a-zA-Z0-9_]*@lovendermgmt\.com$/i.test(value);
        },
        message: "Please enter a valid email address",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (value) {
          return /(?=.*\d)(?=.*[\W_])/.test(value);
        },
        message: "Password must contain at least one number and one special character",
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
        values: ["Chief Manager", "Manager", "User support", "Receptionist"],
        message: "Role must be one of the allowed management staff categories",
      },
      validate: {
        validator: async function (value) {
          if (value !== "Chief Manager") return true;

          const count = await mongoose.models.ManagementStaff.countDocuments({
            role: "Chief Manager",
            _id: { $ne: this._id },
          });

          return count === 0;
        },
        message: "You can't choose that role",
      },
    },
  },
  {
    timestamps: true,
    collection: "management_staff",
  }
);

managementStaffSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  if (!this.password) {
    return;
  }

  if (this.password.startsWith("$2")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

managementStaffSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("ManagementStaff", managementStaffSchema);