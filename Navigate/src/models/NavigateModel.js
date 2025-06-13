const mongoose = require("mongoose");

const NavigationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  isGroup: { type: Boolean, default: false },
  groupMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  gpxPoints: [{ lat: Number, lon: Number, alt: Number, time: Date }], // pour GPX
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  altitude: { type: Number },
  totalDistance: { type: Number }, // en mètres
  speedMax: { type: Number }, // en km/h
  notes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Navigation", NavigationSchema);
