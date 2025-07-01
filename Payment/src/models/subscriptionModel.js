const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true, // Un seul abonnement actif par utilisateur
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stripeSubscriptionId: {
      type: String, // Pour les abonnements récurrents
    },
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled", "past_due"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date, // Date d'expiration (pour les abonnements à durée limitée)
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    currentFeatures: {
      maxFavorites: { type: Number, default: 2 },
      maxVehicles: { type: Number, default: 1 },
      premiumSupport: { type: Boolean, default: false },
      advancedAnalytics: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
