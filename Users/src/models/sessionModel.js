const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  refresh_token: { type: String, required: true },
  device_info: { type: String },
  ip_address: { type: String },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true },
});
// TTL pour suppression automatique des sessions expirées
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Session", sessionSchema);
