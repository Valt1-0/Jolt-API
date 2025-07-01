const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "eur",
    },
    interval: {
      type: String,
      enum: ["monthly", "yearly", "one-time"],
      required: true,
    },
    features: {
      maxFavorites: { type: Number, default: 2 },
      maxVehicles: { type: Number, default: 1 },
      premiumSupport: { type: Boolean, default: false },
      advancedAnalytics: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
