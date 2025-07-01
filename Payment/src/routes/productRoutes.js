const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");

// Routes publiques
router.get(
  "/",
  /* 
    #swagger.tags = ['Product']
    #swagger.summary = 'Récupérer tous les produits'
    #swagger.description = 'Récupère la liste de tous les produits actifs (plans d\'abonnement)'
    #swagger.responses[200] = {
      description: 'Liste des produits récupérée avec succès',
      schema: {
        success: true,
        data: [
          {
            _id: "507f1f77bcf86cd799439011",
            name: "Plan Basic",
            description: "Plan de base avec 2 favoris",
            price: 500,
            currency: "eur",
            interval: "monthly",
            features: {
              maxFavorites: 2,
              maxVehicles: 1,
              premiumSupport: false,
              advancedAnalytics: false
            },
            isActive: true
          }
        ],
        message: "Products retrieved successfully"
      }
    }
  */
  productController.getAllProducts
);

router.get(
  "/:id",
  /* 
    #swagger.tags = ['Product']
    #swagger.summary = 'Récupérer un produit par ID'
    #swagger.description = 'Récupère les détails d\'un produit spécifique'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du produit',
      example: '507f1f77bcf86cd799439011'
    }
    #swagger.responses[200] = {
      description: 'Produit récupéré avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          name: "Plan Premium",
          description: "Plan premium avec 5 favoris et support",
          price: 999,
          currency: "eur",
          interval: "monthly",
          features: {
            maxFavorites: 5,
            maxVehicles: 3,
            premiumSupport: true,
            advancedAnalytics: true
          },
          isActive: true,
          createdAt: "2023-12-01T10:00:00.000Z"
        },
        message: "Product retrieved successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Produit non trouvé',
      schema: { 
        success: false, 
        message: 'Product not found' 
      }
    }
  */
  productController.getProductById
);

// Routes admin
router.post(
  "/",
  /* 
    #swagger.tags = ['Product']
    #swagger.summary = 'Créer un nouveau produit'
    #swagger.description = 'Crée un nouveau plan d\'abonnement'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données du produit',
      required: true,
      schema: {
        type: "object",
        required: ["name", "description", "price", "interval"],
        properties: {
          name: { 
            type: "string", 
            example: "Plan Premium",
            description: "Nom du plan"
          },
          description: { 
            type: "string", 
            example: "Plan premium avec toutes les fonctionnalités",
            description: "Description du plan"
          },
          price: { 
            type: "number", 
            minimum: 50,
            example: 999,
            description: "Prix en centimes (minimum 50 centimes pour EUR)"
          },
          currency: { 
            type: "string", 
            example: "eur",
            description: "Devise (défaut: eur)"
          },
          interval: { 
            type: "string", 
            enum: ["monthly", "yearly", "one-time"],
            example: "monthly",
            description: "Fréquence de facturation"
          },
          features: {
            type: "object",
            properties: {
              maxFavorites: { type: "number", example: 5 },
              maxVehicles: { type: "number", example: 3 },
              premiumSupport: { type: "boolean", example: true },
              advancedAnalytics: { type: "boolean", example: true }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Produit créé avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          name: "Plan Premium",
          description: "Plan premium avec toutes les fonctionnalités",
          price: 999,
          currency: "eur",
          interval: "monthly",
          features: {
            maxFavorites: 5,
            maxVehicles: 3,
            premiumSupport: true,
            advancedAnalytics: true
          },
          isActive: true
        },
        message: "Product created successfully"
      }
    }
    #swagger.responses[400] = {
      description: 'Données invalides',
      schema: { 
        success: false, 
        message: 'Le prix minimum est de 0.50 EUR' 
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
  productController.createProduct
);

router.put(
  "/:id",
  /* 
    #swagger.tags = ['Product']
    #swagger.summary = 'Mettre à jour un produit'
    #swagger.description = 'Met à jour les données d\'un produit existant'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du produit à mettre à jour',
      example: '507f1f77bcf86cd799439011'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données à mettre à jour',
      required: true,
      schema: {
        type: "object",
        properties: {
          name: { type: "string", example: "Plan Premium v2" },
          description: { type: "string", example: "Nouvelle description" },
          price: { type: "number", example: 1299 },
          features: {
            type: "object",
            properties: {
              maxFavorites: { type: "number", example: 10 },
              maxVehicles: { type: "number", example: 5 }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Produit mis à jour avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          name: "Plan Premium v2",
          price: 1299,
          features: {
            maxFavorites: 10,
            maxVehicles: 5
          }
        },
        message: "Product updated successfully"
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
        message: 'Token d\'authentification requis' 
      }
    }
  */
  authenticateToken,
  productController.updateProduct
);

router.delete(
  "/:id",
  /* 
    #swagger.tags = ['Product']
    #swagger.summary = 'Supprimer un produit'
    #swagger.description = 'Désactive un produit (le rend inactif au lieu de le supprimer)'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du produit à supprimer',
      example: '507f1f77bcf86cd799439011'
    }
    #swagger.responses[200] = {
      description: 'Produit supprimé avec succès',
      schema: {
        success: true,
        message: "Product deleted successfully"
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
        message: 'Token d\'authentification requis' 
      }
    }
  */
  authenticateToken,
  productController.deleteProduct
);

module.exports = router;
