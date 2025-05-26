const mongoose = require("mongoose");

const MaintainTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  periodicity: {
    days: { type: Number, default: null },
    km: { type: Number, default: null },
  },
  isDefault: { type: Boolean, default: false }, // true = type global, false = type créé par l'utilisateur
  owner: { type: mongoose.Schema.Types.ObjectId, default: null }, // null si global
});
MaintainTypeSchema.index({ name: 1, owner: 1 }, { unique: true }); // Unique constraint for name and owner
//init defailt types
MaintainTypeSchema.statics.initDefaultTypes = async function () {
  const defaultTypes = [
    {
      name: "Oil Change",
      description: "Change of engine oil and filter",
      periodicity: { days: 180, km: 10000 },
      isDefault: true,
    },
    {
      name: "Tire Rotation",
      description: "Rotation of tires for even wear",
      periodicity: { days: 180, km: 10000 },
      isDefault: true,
    },
    {
      name: "Brake Inspection",
      description: "Inspection of brake pads and discs",
      periodicity: { days: 365, km: 20000 },
      isDefault: true,
    },
  ];

  for (const type of defaultTypes) {
    await this.findOneAndUpdate(
      { name: type.name, owner: null },
      type,
      { upsert: true }
    );
  }
};




module.exports = mongoose.model("MaintainsType", MaintainTypeSchema);
