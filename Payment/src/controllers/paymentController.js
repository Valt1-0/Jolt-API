const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  CreatedSuccess,
} = require("../utils");
const paymentService = require("../services/paymentService");

// Créer une session de paiement Stripe
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, successUrl, cancelUrl } = req.body;

    if (!productId) {
      throw new ValidationError("Product ID is required");
    }

    const session = await paymentService.createCheckoutSession(
      userId,
      productId,
      successUrl || `${process.env.FRONTEND_URL}/payment/success`,
      cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`
    );

    const successResponse = new CreatedSuccess(
      "Checkout session created successfully",
      session
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Webhook Stripe
exports.handleStripeWebhook = async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    await paymentService.handleWebhook(signature, req.body);

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Récupérer tous les paiements d'un utilisateur
exports.getUserPayments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const payments = await paymentService.getUserPayments(userId);

    const successResponse = new OkSuccess(
      "Payments retrieved successfully",
      payments
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Récupérer un paiement par ID
exports.getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const payment = await paymentService.getPaymentById(id, userId);

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    const successResponse = new OkSuccess(
      "Payment retrieved successfully",
      payment
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
