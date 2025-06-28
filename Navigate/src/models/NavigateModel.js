const mongoose = require("mongoose");

const NavigationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  isGroup: { type: Boolean, default: false },
  groupMembers: [{ type: mongoose.Schema.Types.ObjectId }],
  gpxPoints: [
    { lat: Number, lon: Number, alt: Number, time: Date, speed: Number },
  ],
  startLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: undefined }, // [lon, lat]
  },
  startTime: { type: Date, required: false },
  endTime: { type: Date },
  altitude: { type: Number },
  totalDistance: { type: Number }, // en mètres
  speedMax: { type: Number }, // en km/h
  notes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId },
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
NavigationSchema.index({ startLocation: "2dsphere" });
module.exports = mongoose.model("Navigation", NavigationSchema);
