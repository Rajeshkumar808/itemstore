const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot exceed 100 characters"]
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number"
      }
    },
    category: {
      type: String,
      trim: true,
      maxlength: [60, "Category cannot exceed 60 characters"],
      default: "General"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Item || mongoose.model("Item", itemSchema);
