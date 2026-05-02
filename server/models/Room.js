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
        "overwater-standard-bungalow",
        "overwater-bungalow-suite",
        "forest-standard-cabin",
        "forest-cabin-suite",
        "hotel-standard-room",
        "hotel-suite",
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
        "Hotel",
        "Cabin",
        "Bungalow",
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

// Refactor pre-save hook to properly handle `next()`
roomSchema.pre("save", async function (next) {
  try {
    // Set availableRooms equal to totalRooms only if the room is new
    if (this.isNew && this.isModified("totalRooms")) {
      this.availableRooms = this.totalRooms;
    }

    // Ensure `available` is correctly set based on availableRooms
    if (this.isModified("availableRooms")) {
      this.available = this.availableRooms > 0;
    }

    // Proceed to the next function in the chain
    next();
  } catch (error) {
    next(error);  // Pass any error to the next handler
  }
});

module.exports = mongoose.model("Room", roomSchema);