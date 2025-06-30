const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const paymentController = require("../controllers/paymentController");

// Créer un payment intent
router.post(
  "/create-payment-intent",
  /*
    #swagger.tags = ['Payment']
    #swagger.summary = 'Créer un payment intent Stripe'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["amount", "description"],
            properties: {
              amount: {
                type: "number",
                example: 29.99,
                description: "Montant en euros"
              },
              currency: {
                type: "string",
                example: "eur",
                description: "Devise (par défaut: eur)"
              },
              description: {
                type: "string",
                example: "Abonnement premium Jolt",
                description: "Description du paiement"
              },
              customerName: {
                type: "string",
                example: "John Doe",
                description: "Nom du client"
              },
              customerEmail: {
                type: "string",
                example: "john@example.com", 
                description: "Email du client"
              },
              metadata: {
                type: "object",
                description: "Métadonnées supplémentaires"
              }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Payment intent créé avec succès',
      schema: {
        success: true,
        data: {
          paymentId: "507f1f77bcf86cd799439011",
          clientSecret: "pi_xxx_secret_xxx",
          amount: 29.99,
          currency: "eur",
          status: "requires_payment_method"
        }
      }
    }
  */
  authenticateToken,
  paymentController.createPayment
);

// Confirmer un paiement
router.post(
  "/confirm-payment",
  /*
    #swagger.tags = ['Payment']
    #swagger.summary = 'Confirmer un paiement'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["paymentIntentId"],
            properties: {
              paymentIntentId: {
                type: "string",
                example: "pi_1234567890",
                description: "ID du payment intent Stripe"
              },
              paymentMethodId: {
                type: "string",
                example: "pm_1234567890",
                description: "ID de la méthode de paiement"
              }
            }
          }
        }
      }
    }
  */
  authenticateToken,
  paymentController.confirmPayment
);

// Récupérer les paiements de l'utilisateur
router.get(
  "/",
  /*
    #swagger.tags = ['Payment']
    #swagger.summary = 'Récupérer les paiements de l\'utilisateur'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'integer',
      description: 'Numéro de page (défaut: 1)'
    }
    #swagger.parameters['limit'] = {
      in: 'query', 
      type: 'integer',
      description: 'Nombre d\'éléments par page (défaut: 10)'
    }
  */
  authenticateToken,
  paymentController.getUserPayments
);

// Récupérer un paiement spécifique
router.get(
  "/:paymentId",
  /*
    #swagger.tags = ['Payment']
    #swagger.summary = 'Récupérer un paiement par ID'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['paymentId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du paiement'
    }
  */
  authenticateToken,
  paymentController.getPaymentById
);

// Demander un remboursement
router.post(
  "/:paymentId/refund",
  /*
    #swagger.tags = ['Payment']
    #swagger.summary = 'Demander un remboursement'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['paymentId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du paiement'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              amount: {
                type: "number",
                description: "Montant à rembourser (optionnel, remboursement total par défaut)"
              },
              reason: {
                type: "string",
                example: "requested_by_customer",
                description: "Raison du remboursement"
              }
            }
          }
        }
      }
    }
  */
  authenticateToken,
  paymentController.requestRefund
);

// Statistiques de paiement
router.get(
  "/stats/summary",
  /*
    #swagger.tags = ['Payment']
    #swagger.summary = 'Récupérer les statistiques de paiement'
    #swagger.security = [{ "bearerAuth": [] }]
  */
  authenticateToken,
  paymentController.getPaymentStats
);

// Webhook Stripe (sans authentification)
router.post(
  "/webhook/stripe",
  /*
    #swagger.tags = ['Payment']
    #swagger.summary = 'Webhook Stripe'
    #swagger.description = 'Endpoint pour recevoir les événements Stripe'
  */
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhook
);

module.exports = router;
