const {
  ValidationError,
  NotFoundError,
  OkSuccess,
  CreatedSuccess,
} = require("../utils");
const subscriptionService = require("../services/subscriptionService");

// Récupérer l'abonnement actuel de l'utilisateur
exports.getSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subscription = await subscriptionService.getUserSubscription(userId);

    const successResponse = new OkSuccess(
      "Subscription retrieved successfully",
      subscription
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Créer un abonnement (utilisé par le webhook Stripe)
exports.createSubscription = async (req, res, next) => {
  try {
    const subscriptionData = req.body;
    const newSubscription = await subscriptionService.createSubscription(
      subscriptionData
    );

    const successResponse = new CreatedSuccess(
      "Subscription created successfully",
      newSubscription
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Annuler un abonnement
exports.cancelSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cancelledSubscription = await subscriptionService.cancelSubscription(
      userId
    );

    const successResponse = new OkSuccess(
      "Subscription cancelled successfully",
      cancelledSubscription
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un abonnement
exports.updateSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const updatedSubscription = await subscriptionService.updateSubscription(
      userId,
      updateData
    );

    const successResponse = new OkSuccess(
      "Subscription updated successfully",
      updatedSubscription
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Historique des abonnements
exports.getSubscriptionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await subscriptionService.getSubscriptionHistory(userId);

    const successResponse = new OkSuccess(
      "Subscription history retrieved successfully",
      history
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Récupérer un abonnement par ID
exports.getSubscriptionById = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.id;
    const subscription = await subscriptionService.getSubscriptionById(
      subscriptionId,
      userId
    );

    if (!subscription) {
      throw new NotFoundError("Subscription not found");
    }

    const successResponse = new OkSuccess(
      "Subscription retrieved successfully",
      subscription
    );
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};

// Supprimer un abonnement
exports.deleteSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.id;

    await subscriptionService.deleteSubscription(subscriptionId, userId);

    const successResponse = new OkSuccess("Subscription deleted successfully");
    return res
      .status(successResponse.statusCode)
      .json(successResponse.toJSON());
  } catch (error) {
    next(error);
  }
};
