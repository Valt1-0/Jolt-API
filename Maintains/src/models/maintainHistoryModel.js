const mongoose = require("mongoose");

const MaintenanceHistorySchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MaintainsType",
  },
  date: { type: Date, default: Date.now() }, // date de la maintenance
  mileage: { type: Number, required: true }, // kilométrage au moment de la maintenance
  performedBy: { type: String, enum: ["user", "pro"], default: "user" },
  proName: { type: String }, // nom du garage/pro si applicable
  invoiceUrl: [{ type: String }], // lien vers la facture (upload)
  notes: { type: String },
});

module.exports = mongoose.model("MaintainsHistory", MaintenanceHistorySchema);
