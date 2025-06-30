const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  verifyUser,
  verifyEmailToken,
  updateVerificationToken,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get(
  "/",
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Récupérer la liste des utilisateurs'
    #swagger.parameters['query'] = {
      in: 'query',
      description: 'Filtre par username ou email sous la forme username:John',
      required: false,
      type: 'string'
    }
    #swagger.parameters['page'] = { 
      in: 'query', 
      type: 'integer', 
      description: 'Page de pagination (défaut: 1)' 
    }
    #swagger.parameters['limit'] = { 
      in: 'query', 
      type: 'integer', 
      description: 'Nombre d\'utilisateurs par page (défaut: 10)' 
    }
    #swagger.responses[200] = {
      description: 'Liste des utilisateurs retournée avec succès',
      schema: {
        success: true,
        data: [
          {
            _id: "507f1f77bcf86cd799439011",
            username: "JohnDoe",
            email: "john@doe.com",
            role: "member",
            profilePicture: "http://localhost:5000/uploads/profile.jpg"
          }
        ],
        message: "Utilisateurs récupérés avec succès"
      }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur',
      schema: { success: false, message: 'Erreur interne du serveur' }
    }
  */
  getAllUsers
);

router.get(
  "/get",
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Récupérer un utilisateur via son ID ou email'
    #swagger.parameters['query'] = {
      in: 'query',
      description: 'ID ou email de l\'utilisateur à rechercher',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Utilisateur trouvé',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          username: "JohnDoe",
          email: "john@doe.com",
          role: "member",
          profilePicture: "http://localhost:5000/uploads/profile.jpg"
        },
        message: "Utilisateur trouvé"
      }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur non trouvé',
      schema: { success: false, message: 'Utilisateur non trouvé' }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur',
      schema: { success: false, message: 'Erreur interne du serveur' }
    }
  */
  getUser
);

router.get(
  "/verifyEmail",
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Vérifier le token d\'activation de compte'
    #swagger.parameters['token'] = {
      in: 'query',
      description: 'Token de vérification d\'email',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Email vérifié avec succès',
      schema: { success: true, message: "Email vérifié avec succès" }
    }
    #swagger.responses[404] = {
      description: 'Token invalide ou expiré',
      schema: { success: false, message: 'Token invalide ou expiré' }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur',
      schema: { success: false, message: 'Erreur interne du serveur' }
    }
  */
  verifyEmailToken
);

router.post(
  "/create",
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Créer un nouvel utilisateur'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string', example: 'JohnDoe' },
              email: { type: 'string', example: 'john@doe.com' },
              password: { type: 'string', example: 'password123' }
            },
            required: ['username', 'email', 'password']
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Utilisateur créé avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          username: "JohnDoe",
          email: "john@doe.com"
        },
        message: "Utilisateur créé avec succès"
      }
    }
    #swagger.responses[400] = {
      description: 'Requête invalide',
      schema: { success: false, message: 'Email déjà utilisé' }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur',
      schema: { success: false, message: 'Erreur interne du serveur' }
    }
  */
  createUser
);

router.post(
  "/verify",
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Vérifier les identifiants de connexion'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'john@doe.com' },
              password: { type: 'string', example: 'password123' }
            },
            required: ['email', 'password']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Connexion réussie',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          username: "JohnDoe",
          email: "john@doe.com",
          role: "member"
        },
        message: "Connexion réussie"
      }
    }
    #swagger.responses[401] = {
      description: 'Identifiants invalides',
      schema: { success: false, message: 'Email ou mot de passe incorrect' }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur',
      schema: { success: false, message: 'Erreur interne du serveur' }
    }
  */
  verifyUser
);

router.put(
  "/updateVerificationToken",
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Mettre à jour le token de vérification'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'john@doe.com' },
              verificationToken: { type: 'string', example: 'newToken123' },
              verificationTokenExpires: { 
                type: 'string', 
                format: 'date-time', 
                example: '2025-06-30T12:00:00Z' 
              }
            },
            required: ['email', 'verificationToken']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Token mis à jour',
      schema: { success: true, message: "Token de vérification mis à jour" }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable',
      schema: { success: false, message: 'Utilisateur introuvable' }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur',
      schema: { success: false, message: 'Erreur interne du serveur' }
    }
  */
  updateVerificationToken
);

router.delete(
  "/delete",
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Supprimer un utilisateur'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              userId: { type: 'string', example: 'userId123' }
            },
            required: ['userId']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Utilisateur supprimé',
      schema: { success: true, message: "Utilisateur supprimé avec succès" }
    }
    #swagger.responses[400] = {
      description: 'Requête invalide',
      schema: { success: false, message: 'userId requis' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable',
      schema: { success: false, message: 'Utilisateur introuvable' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur',
      schema: { success: false, message: 'Erreur interne du serveur' }
    }
  */
  authenticateToken,
  deleteUser
);

router.patch(
  "/update/:id",
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Modifier les informations d\'un utilisateur'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID de l\'utilisateur à modifier',
      required: true,
      type: 'string'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: 'object',
            additionalProperties: true,
            example: {
              username: 'JaneDoe',
              email: 'jane@doe.com'
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Utilisateur mis à jour',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          username: "JaneDoe",
          email: "jane@doe.com"
        },
        message: "Utilisateur mis à jour avec succès"
      }
    }
    #swagger.responses[400] = {
      description: 'Requête invalide',
      schema: { success: false, message: 'Données invalides' }
    }
    #swagger.responses[404] = {
      description: 'Utilisateur introuvable',
      schema: { success: false, message: 'Utilisateur introuvable' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur',
      schema: { success: false, message: 'Erreur interne du serveur' }
    }
  */
  authenticateToken,
  updateUser
);

module.exports = router;
