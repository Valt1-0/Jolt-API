const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  firstPurchaseDate: {
    // date de première mise en circulation
    type: Date,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/2641/2641824.png", // image par défaut
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vehicles", VehicleSchema);
