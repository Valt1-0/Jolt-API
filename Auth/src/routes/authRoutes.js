const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

router.post(
  "/getToken",
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Connexion utilisateur'
    #swagger.description = 'Connexion d\'un utilisateur avec email et mot de passe'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Identifiants de connexion',
      required: true,
      schema: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "test@joltz.fr" },
          password: { type: "string", example: "motdepasse" }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Connexion réussie',
      schema: {
        success: true,
        data: {
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          user: {
            id: "507f1f77bcf86cd799439011",
            email: "test@joltz.fr",
            username: "testuser"
          }
        },
        message: "Connexion réussie"
      }
    }
    #swagger.responses[401] = {
      description: 'Identifiants invalides',
      schema: { success: false, message: 'Email ou mot de passe incorrect' }
    }
    #swagger.responses[400] = {
      description: 'Données manquantes',
      schema: { success: false, message: 'Email et mot de passe requis' }
    }
  */
  authController.getToken
);

router.post(
  "/refreshToken",
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Rafraîchir le token d\'accès'
    #swagger.description = 'Génère un nouveau token d\'accès à partir du refresh token'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Refresh token (optionnel si dans cookies)',
      required: false,
      schema: {
        type: "object",
        properties: {
          refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Token rafraîchi avec succès',
      schema: {
        success: true,
        data: {
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        },
        message: "Token rafraîchi avec succès"
      }
    }
    #swagger.responses[401] = {
      description: 'Refresh token invalide',
      schema: { success: false, message: 'Refresh token invalide ou expiré' }
    }
  */
  authController.refreshToken
);

router.post(
  "/register",
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Inscription d\'un nouvel utilisateur'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données d\'inscription',
      required: true,
      schema: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", example: "John" },
          email: { type: "string", example: "john@doe.com" },
          password: { type: "string", example: "motdepasse" }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Utilisateur créé avec succès',
      schema: {
        success: true,
        data: {
          id: "507f1f77bcf86cd799439011",
          username: "John",
          email: "john@doe.com"
        },
        message: "Utilisateur créé avec succès"
      }
    }
    #swagger.responses[400] = {
      description: 'Données invalides',
      schema: { success: false, message: 'Email déjà utilisé' }
    }
  */
  authController.registerUser
);

router.post(
  "/logout",
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Déconnexion de l\'utilisateur'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Refresh token (optionnel si dans cookies)',
      required: false,
      schema: {
        type: "object",
        properties: {
          refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Déconnexion réussie',
      schema: { success: true, message: "Déconnexion réussie" }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  authController.logout
);

router.post(
  "/resendVerificationEmail",
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Renvoyer l\'email de vérification'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Email de l\'utilisateur',
      required: true,
      schema: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", example: "john@doe.com" }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Email de vérification renvoyé',
      schema: { success: true, message: "Email de vérification renvoyé" }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur non trouvé',
      schema: { success: false, message: 'Utilisateur non trouvé' }
    }
  */
  authController.resendVerificationEmail
);

module.exports = router;
