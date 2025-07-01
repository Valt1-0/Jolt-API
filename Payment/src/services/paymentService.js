const Payment = require("../models/paymentModel");
const Product = require("../models/productModel");
const Subscription = require("../models/subscriptionModel");
const utils = require("../utils");
const { NotFoundError } = require("../utils");
const stripe = utils.stripe;
exports.createCheckoutSession = async (
  userId,
  productId,
  successUrl,
  cancelUrl
) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product not found");

    const sessionConfig = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: product.currency || "eur",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price, // en centimes
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
        productId: productId.toString(),
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    // Ajouter mode selon le type de produit
    if (product.interval === "one-time") {
      sessionConfig.mode = "payment";
    } else {
      sessionConfig.mode = "subscription";
      // Ajouter la récurrence
      sessionConfig.line_items[0].price_data.recurring = {
        interval: product.interval === "yearly" ? "year" : "month",
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Enregistrer le paiement en pending
    const payment = new Payment({
      userId,
      productId,
      stripeSessionId: session.id,
      amount: product.price,
      currency: product.currency,
      status: "pending",
      method: "credit_card",
      paymentMethod: "stripe_card",
    });
    await payment.save();

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    throw error;
  }
};

exports.handleWebhook = async (signature, payload) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
    }
  } catch (error) {
    throw error;
  }
};

const handleCheckoutCompleted = async (session) => {
  const payment = await Payment.findOne({ stripeSessionId: session.id });
  if (payment) {
    payment.status = "completed";
    payment.stripePaymentIntentId = session.payment_intent;
    await payment.save();

    // Activer l'abonnement pour l'utilisateur
    await activateUserSubscription(
      payment.userId,
      payment.productId,
      session.subscription
    );
  }
};

const handlePaymentSucceeded = async (paymentIntent) => {
  // Logique pour paiement unique réussi
  console.log("Payment succeeded:", paymentIntent.id);
};

const handleSubscriptionCreated = async (subscription) => {
  // Gérer la création d'abonnement récurrent
  console.log("Subscription created:", subscription.id);
};

const handleSubscriptionUpdated = async (subscription) => {
  // Mettre à jour l'abonnement local
  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      status: subscription.status === "active" ? "active" : "inactive",
      endDate:
        subscription.current_period_end &&
        new Date(subscription.current_period_end * 1000),
    }
  );
};

const handleSubscriptionDeleted = async (subscription) => {
  // Annuler l'abonnement local
  await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    { status: "cancelled" }
  );
};

const activateUserSubscription = async (
  userId,
  productId,
  stripeSubscriptionId
) => {
  const product = await Product.findById(productId);

  // Mettre à jour ou créer l'abonnement de l'utilisateur
  await Subscription.findOneAndUpdate(
    { userId },
    {
      userId,
      productId,
      stripeSubscriptionId,
      status: "active",
      currentFeatures: product.features,
      startDate: new Date(),
      endDate:
        product.interval === "one-time"
          ? null
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    },
    { upsert: true, new: true }
  );
};

exports.getUserPayments = async (userId) => {
  return await Payment.find({ userId })
    .populate("productId")
    .sort({ createdAt: -1 });
};

exports.getPaymentById = async (paymentId, userId) => {
  return await Payment.findOne({ _id: paymentId, userId }).populate(
    "productId"
  );
};
