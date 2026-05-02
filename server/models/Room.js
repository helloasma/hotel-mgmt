const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Room title is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Room type is required"],
      enum: ["Suite", "Standard"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: 1,
      max: 6,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Bungalow",
        "Cabin",
        "Hotel",
      ],
    },
    size: {
      type: String,
    },
    bed: {
      type: String,
    },
    view: {
      type: String,
    },
    totalRooms: {
      type: Number, // Total number of rooms of this type
      required: true,
    },
    availableRooms: {
      type: Number, // Remaining available rooms of this type
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.pre("save", async function () {
  if (this.isNew && this.isModified("totalRooms")) {
    this.availableRooms = this.totalRooms;
  }
  if (this.isModified("availableRooms")) {
    this.available = this.availableRooms > 0;
  }
});

module.exports = mongoose.model("Room", roomSchema);