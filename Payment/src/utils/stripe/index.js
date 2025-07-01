const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Configuration par défaut
const stripeConfig = {
  apiVersion: "2023-10-16", // Version API Stripe
  maxNetworkRetries: 3,
  timeout: 20000, // 20 secondes
};

// Appliquer la configuration
Object.assign(stripe, stripeConfig);

module.exports = stripe;
