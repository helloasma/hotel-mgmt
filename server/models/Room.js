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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);