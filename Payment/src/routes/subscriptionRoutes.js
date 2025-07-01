const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const subscriptionController = require("../controllers/subscriptionController");

router.get(
  "/",
  /* 
    #swagger.tags = ['Subscription']
    #swagger.summary = 'Récupérer l\'abonnement actuel de l\'utilisateur'
    #swagger.description = 'Récupère l\'abonnement actif de l\'utilisateur connecté avec ses features'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Abonnement récupéré avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          userId: "507f1f77bcf86cd799439012",
          productId: {
            _id: "507f1f77bcf86cd799439013",
            name: "Plan Premium",
            price: 999,
            features: {
              maxFavorites: 5,
              maxVehicles: 3,
              premiumSupport: true,
              advancedAnalytics: true
            }
          },
          status: "active",
          currentFeatures: {
            maxFavorites: 5,
            maxVehicles: 3,
            premiumSupport: true,
            advancedAnalytics: true
          },
          startDate: "2023-12-01T10:00:00.000Z",
          endDate: "2024-01-01T10:00:00.000Z",
          autoRenew: true
        },
        message: "Subscription retrieved successfully"
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { 
        success: false, 
        message: 'Token d\'authentification requis' 
      }
    }
  */
  authenticateToken,
  subscriptionController.getSubscription
);

router.post(
  "/create",
  /* 
    #swagger.tags = ['Subscription']
    #swagger.summary = 'Créer un abonnement'
    #swagger.description = 'Crée un nouvel abonnement (généralement utilisé par les webhooks Stripe)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données de l\'abonnement',
      required: true,
      schema: {
        type: "object",
        required: ["userId", "productId"],
        properties: {
          userId: { 
            type: "string", 
            example: "507f1f77bcf86cd799439012",
            description: "ID de l utilisateur"
          },
          productId: { 
            type: "string", 
            example: "507f1f77bcf86cd799439013",
            description: "ID du produit"
          },
          stripeSubscriptionId: { 
            type: "string", 
            example: "sub_1J2Y3Z4A5B6C7D8E9F0G1H2I3J",
            description: "ID de l abonnement Stripe (optionnel)"
          },
          status: { 
            type: "string", 
            enum: ["active", "inactive", "cancelled", "past_due"],
            example: "active"
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Abonnement créé avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          userId: "507f1f77bcf86cd799439012",
          productId: "507f1f77bcf86cd799439013",
          status: "active",
          startDate: "2023-12-01T10:00:00.000Z"
        },
        message: "Subscription created successfully"
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { 
        success: false, 
        message: 'Token d\'authentification requis' 
      }
    }
  */
  authenticateToken,
  subscriptionController.createSubscription
);

router.post(
  "/cancel",
  /* 
    #swagger.tags = ['Subscription']
    #swagger.summary = 'Annuler l\'abonnement'
    #swagger.description = 'Annule l\'abonnement actif de l\'utilisateur'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Abonnement annulé avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          userId: "507f1f77bcf86cd799439012",
          status: "cancelled",
          autoRenew: false
        },
        message: "Subscription cancelled successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Aucun abonnement actif trouvé',
      schema: { 
        success: false, 
        message: 'Active subscription not found' 
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { 
        success: false, 
        message: 'Token d\'authentification requis' 
      }
    }
  */
  authenticateToken,
  subscriptionController.cancelSubscription
);

router.post(
  "/update",
  /* 
    #swagger.tags = ['Subscription']
    #swagger.summary = 'Mettre à jour l\'abonnement'
    #swagger.description = 'Met à jour les données de l\'abonnement de l\'utilisateur'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données à mettre à jour',
      required: true,
      schema: {
        type: "object",
        properties: {
          autoRenew: { 
            type: "boolean", 
            example: false,
            description: "Renouvellement automatique"
          },
          currentFeatures: {
            type: "object",
            properties: {
              maxFavorites: { type: "number", example: 10 },
              maxVehicles: { type: "number", example: 5 },
              premiumSupport: { type: "boolean", example: true }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Abonnement mis à jour avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          userId: "507f1f77bcf86cd799439012",
          autoRenew: false,
          currentFeatures: {
            maxFavorites: 10,
            maxVehicles: 5,
            premiumSupport: true
          }
        },
        message: "Subscription updated successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Abonnement non trouvé',
      schema: { 
        success: false, 
        message: 'Subscription not found' 
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { 
        success: false, 
        message: 'Token d\'authentification requis' 
      }
    }
  */
  authenticateToken,
  subscriptionController.updateSubscription
);

router.get(
  "/history",
  /* 
    #swagger.tags = ['Subscription']
    #swagger.summary = 'Historique des abonnements'
    #swagger.description = 'Récupère l\'historique complet des abonnements de l\'utilisateur'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Historique récupéré avec succès',
      schema: {
        success: true,
        data: [
          {
            _id: "507f1f77bcf86cd799439011",
            userId: "507f1f77bcf86cd799439012",
            productId: {
              name: "Plan Premium",
              price: 999
            },
            status: "cancelled",
            startDate: "2023-11-01T10:00:00.000Z",
            endDate: "2023-12-01T10:00:00.000Z"
          }
        ],
        message: "Subscription history retrieved successfully"
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { 
        success: false, 
        message: 'Token d\'authentification requis' 
      }
    }
  */
  authenticateToken,
  subscriptionController.getSubscriptionHistory
);

router.get(
  "/:subscriptionId",
  /* 
    #swagger.tags = ['Subscription']
    #swagger.summary = 'Récupérer un abonnement par ID'
    #swagger.description = 'Récupère les détails d\'un abonnement spécifique'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['subscriptionId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de l\'abonnement',
      example: '507f1f77bcf86cd799439011'
    }
    #swagger.responses[200] = {
      description: 'Abonnement récupéré avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          userId: "507f1f77bcf86cd799439012",
          productId: {
            name: "Plan Premium",
            features: {
              maxFavorites: 5,
              maxVehicles: 3
            }
          },
          status: "active",
          startDate: "2023-12-01T10:00:00.000Z"
        },
        message: "Subscription retrieved successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Abonnement non trouvé',
      schema: { 
        success: false, 
        message: 'Subscription not found' 
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { 
        success: false, 
        message: 'Token d\'authentification requis' 
      }
    }
  */
  authenticateToken,
  subscriptionController.getSubscriptionById
);

router.delete(
  "/:subscriptionId",
  /* 
    #swagger.tags = ['Subscription']
    #swagger.summary = 'Supprimer un abonnement'
    #swagger.description = 'Supprime définitivement un abonnement'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['subscriptionId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de l\'abonnement à supprimer',
      example: '507f1f77bcf86cd799439011'
    }
    #swagger.responses[200] = {
      description: 'Abonnement supprimé avec succès',
      schema: {
        success: true,
        message: "Subscription deleted successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Abonnement non trouvé',
      schema: { 
        success: false, 
        message: 'Subscription not found' 
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { 
        success: false, 
        message: 'Token d\'authentification requis' 
      }
    }
  */
  authenticateToken,
  subscriptionController.deleteSubscription
);

module.exports = router;
