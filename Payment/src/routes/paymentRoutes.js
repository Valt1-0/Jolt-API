const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const paymentController = require("../controllers/paymentController");

// Créer une session de paiement
router.post(
  "/checkout",
  /* 
    #swagger.tags = ['Payment']
    #swagger.summary = 'Créer une session de paiement Stripe'
    #swagger.description = 'Crée une session Stripe Checkout pour effectuer un paiement'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données pour créer la session de paiement',
      required: true,
      schema: {
        type: "object",
        required: ["productId"],
        properties: {
          productId: { 
            type: "string", 
            example: "507f1f77bcf86cd799439011",
            description: "ID du produit à acheter"
          },
          successUrl: { 
            type: "string", 
            example: "https://yourapp.com/payment/success",
            description: "URL de redirection en cas de succès (optionnel)"
          },
          cancelUrl: { 
            type: "string", 
            example: "https://yourapp.com/payment/cancel",
            description: "URL de redirection en cas d annulation (optionnel)"
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Session de paiement créée avec succès',
      schema: {
        success: true,
        data: {
          sessionId: "cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
          url: "https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
        },
        message: "Checkout session created successfully"
      }
    }
    #swagger.responses[400] = {
      description: 'Données invalides',
      schema: { 
        success: false, 
        message: 'Product ID is required' 
      }
    }
    #swagger.responses[404] = {
      description: 'Produit non trouvé',
      schema: { 
        success: false, 
        message: 'Product not found' 
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { 
        success: false, 
        message: 'Token d authentification requis' 
      }
    }
  */
  authenticateToken,
  paymentController.createCheckoutSession
);

// Récupérer les paiements de l'utilisateur
router.get(
  "/",
  /* 
    #swagger.tags = ['Payment']
    #swagger.summary = 'Récupérer tous les paiements de l utilisateur'
    #swagger.description = 'Récupère l historique des paiements de l utilisateur connecté'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Liste des paiements récupérée avec succès',
      schema: {
        success: true,
        data: [
          {
            _id: "507f1f77bcf86cd799439011",
            userId: "507f1f77bcf86cd799439012",
            productId: {
              _id: "507f1f77bcf86cd799439013",
              name: "Plan Premium",
              price: 999,
              currency: "eur"
            },
            amount: 999,
            currency: "eur",
            status: "completed",
            method: "credit_card",
            createdAt: "2023-12-01T10:00:00.000Z"
          }
        ],
        message: "Payments retrieved successfully"
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { 
        success: false, 
        message: 'Token d authentification requis' 
      }
    }
  */
  authenticateToken,
  paymentController.getUserPayments
);

router.get(
  "/:id",
  /* 
    #swagger.tags = ['Payment']
    #swagger.summary = 'Récupérer un paiement par ID'
    #swagger.description = 'Récupère les détails d un paiement spécifique'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du paiement',
      example: '507f1f77bcf86cd799439011'
    }
    #swagger.responses[200] = {
      description: 'Paiement récupéré avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          userId: "507f1f77bcf86cd799439012",
          productId: {
            _id: "507f1f77bcf86cd799439013",
            name: "Plan Premium",
            price: 999,
            currency: "eur"
          },
          amount: 999,
          currency: "eur",
          status: "completed",
          method: "credit_card",
          stripeSessionId: "cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
          createdAt: "2023-12-01T10:00:00.000Z"
        },
        message: "Payment retrieved successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Paiement non trouvé',
      schema: { 
        success: false, 
        message: 'Payment not found' 
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { 
        success: false, 
        message: 'Token d authentification requis' 
      }
    }
  */
  authenticateToken,
  paymentController.getPaymentById
);

module.exports = router;
