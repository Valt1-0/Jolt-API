const mongoose = require("mongoose");

const FavoriteAddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  label: { type: String, required: true }, // nom personnalisé
  addressName: { type: String, required: true }, // nom de l'adresse (ex: "Maison", "Travail")
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  position: { type: Number, default: 0 }, // position dans la liste des adresses favorites
});

module.exports = mongoose.model("FavoriteAddress", FavoriteAddressSchema);
