const mongoose = require("mongoose");

const UserProjectionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  profilePicture: String,
  email: String,
  role: String,
  region: String,
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserProjection", UserProjectionSchema);
