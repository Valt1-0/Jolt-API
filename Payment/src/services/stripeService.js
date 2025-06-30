const stripe = require("stripe")(require("../Config").STRIPE_SECRET_KEY);
const { PaymentError } = require("../utils");

class StripeService {
  // Créer un customer Stripe
  async createCustomer(userData) {
    try {
      const customer = await stripe.customers.create({
        email: userData.email,
        name: userData.name || userData.username,
        metadata: {
          userId: userData.userId,
        },
      });
      return customer;
    } catch (error) {
      throw new PaymentError(
        `Erreur création customer Stripe: ${error.message}`
      );
    }
  }

  // Créer un payment intent
  async createPaymentIntent(
    amount,
    currency,
    customerId,
    description,
    metadata = {}
  ) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe utilise les centimes
        currency: currency.toLowerCase(),
        customer: customerId,
        description,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      return paymentIntent;
    } catch (error) {
      throw new PaymentError(
        `Erreur création payment intent: ${error.message}`
      );
    }
  }

  // Confirmer un payment intent
  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
        }
      );
      return paymentIntent;
    } catch (error) {
      throw new PaymentError(`Erreur confirmation paiement: ${error.message}`);
    }
  }

  // Récupérer un payment intent
  async retrievePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      return paymentIntent;
    } catch (error) {
      throw new PaymentError(`Erreur récupération paiement: ${error.message}`);
    }
  }

  // Créer un remboursement
  async createRefund(
    paymentIntentId,
    amount,
    reason = "requested_by_customer"
  ) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Si pas de montant, remboursement total
        reason,
      });
      return refund;
    } catch (error) {
      throw new PaymentError(`Erreur remboursement: ${error.message}`);
    }
  }

  // Construire l'événement webhook
  constructWebhookEvent(payload, signature, webhookSecret) {
    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      throw new PaymentError(`Webhook signature invalide: ${error.message}`);
    }
  }
}

module.exports = new StripeService();
