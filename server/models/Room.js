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
      enum: [
        "overwater-bungalow",
        "overwater-bungalow-suite",
        "forest-cabin",
        "forest-cabin-suite",
        "mountain-room",
        "mountain-suite",
        "mountain-hotel-deluxe",
        "honeymoon",
        "classic-standard",
      ],
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

roomSchema.pre("save", function (next) {
  if (this.isNew && this.isModified("totalRooms")) {
    this.availableRooms = this.totalRooms;
  }
  if (this.isModified("availableRooms")) {
    this.available = this.availableRooms > 0;
  }
  next();
});

module.exports = mongoose.model("Room", roomSchema);