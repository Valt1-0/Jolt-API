const mongoose = require("mongoose");

const pushTokenSchema = new mongoose.Schema({
  expoPushToken: { type: String, required: true },
  deviceId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: false },
  createdAt: { type: Date, default: Date.now },
});

pushTokenSchema.index({ deviceId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("PushToken", pushTokenSchema);
