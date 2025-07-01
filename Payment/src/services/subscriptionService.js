const Subscription = require("../models/subscriptionModel");
const Product = require("../models/productModel");
const { NotFoundError } = require("../utils");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getUserSubscription = async (userId) => {
  const subscription = await Subscription.findOne({ userId })
    .populate("productId")
    .sort({ createdAt: -1 });

  // Si pas d'abonnement, retourner les features par défaut
  if (!subscription) {
    return {
      status: "inactive",
      currentFeatures: {
        maxFavorites: 2,
        maxVehicles: 1,
        premiumSupport: false,
        advancedAnalytics: false,
      },
    };
  }

  return subscription;
};

exports.createSubscription = async (subscriptionData) => {
  const subscription = new Subscription(subscriptionData);
  return await subscription.save();
};

exports.cancelSubscription = async (userId) => {
  const subscription = await Subscription.findOne({ userId, status: "active" });
  if (!subscription) {
    throw new NotFoundError("Active subscription not found");
  }

  // Annuler dans Stripe si c'est un abonnement récurrent
  if (subscription.stripeSubscriptionId) {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  // Mettre à jour le statut local
  subscription.status = "cancelled";
  subscription.autoRenew = false;
  await subscription.save();

  return subscription;
};

exports.updateSubscription = async (userId, updateData) => {
  const subscription = await Subscription.findOneAndUpdate(
    { userId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!subscription) {
    throw new NotFoundError("Subscription not found");
  }

  return subscription;
};

exports.getSubscriptionHistory = async (userId) => {
  return await Subscription.find({ userId })
    .populate("productId")
    .sort({ createdAt: -1 });
};

exports.getSubscriptionById = async (subscriptionId, userId) => {
  return await Subscription.findOne({
    _id: subscriptionId,
    userId,
  }).populate("productId");
};

exports.deleteSubscription = async (subscriptionId, userId) => {
  const subscription = await Subscription.findOneAndDelete({
    _id: subscriptionId,
    userId,
  });

  if (!subscription) {
    throw new NotFoundError("Subscription not found");
  }

  return subscription;
};
