const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const controller = require("../controllers/FavoriteAddressController");

router.post(
  "/",
  /* 
    #swagger.tags = ['FavoriteAddress']
    #swagger.summary = 'Ajouter une adresse favorite'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données de l\'adresse favorite',
      required: true,
      schema: {
        type: "object",
        required: ["name", "address"],
        properties: {
          name: { type: "string", example: "Maison" },
          address: { type: "string", example: "123 Rue de la Paix, Paris" },
          latitude: { type: "number", example: 48.8566 },
          longitude: { type: "number", example: 2.3522 },
          icon: { type: "string", example: "home" }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Adresse favorite ajoutée avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          name: "Maison",
          address: "123 Rue de la Paix, Paris",
          latitude: 48.8566,
          longitude: 2.3522,
          position: 0,
          user: "507f1f77bcf86cd799439012"
        },
        message: "Favorite address added"
      }
    }
    #swagger.responses[400] = {
      description: 'Données invalides',
      schema: { success: false, message: 'Données d\'adresse invalides' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  controller.addFavorite
);

router.get(
  "/",
  /* 
    #swagger.tags = ['FavoriteAddress']
    #swagger.summary = 'Récupérer les adresses favorites de l\'utilisateur'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.responses[200] = {
      description: 'Liste des adresses favorites',
      schema: {
        success: true,
        data: [
          {
            _id: "507f1f77bcf86cd799439011",
            name: "Maison",
            address: "123 Rue de la Paix, Paris",
            latitude: 48.8566,
            longitude: 2.3522,
            position: 0,
            icon: "home"
          }
        ],
        message: "Favorite addresses"
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  controller.getFavorites
);

router.delete(
  "/:id",
  /* 
    #swagger.tags = ['FavoriteAddress']
    #swagger.summary = 'Supprimer une adresse favorite'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de l\'adresse favorite'
    }
    #swagger.responses[200] = {
      description: 'Adresse favorite supprimée',
      schema: { success: true, message: "Favorite address deleted" }
    }
    #swagger.responses[404] = {
      description: 'Adresse non trouvée',
      schema: { success: false, message: 'Adresse favorite non trouvée' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  controller.deleteFavorite
);

router.put(
  "/:id",
  /* 
    #swagger.tags = ['FavoriteAddress']
    #swagger.summary = 'Mettre à jour une adresse favorite'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de l\'adresse favorite'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données à mettre à jour',
      required: true,
      schema: {
        type: "object",
        properties: {
          name: { type: "string", example: "Nouveau nom" },
          address: { type: "string", example: "Nouvelle adresse" },
          latitude: { type: "number", example: 48.8566 },
          longitude: { type: "number", example: 2.3522 },
          icon: { type: "string", example: "work" }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Adresse favorite mise à jour',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          name: "Nouveau nom",
          address: "Nouvelle adresse"
        },
        message: "Favorite address updated"
      }
    }
    #swagger.responses[404] = {
      description: 'Adresse non trouvée',
      schema: { success: false, message: 'Adresse favorite non trouvée' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  controller.updateFavorite
);

router.patch(
  "/:id/position",
  /* 
    #swagger.tags = ['FavoriteAddress']
    #swagger.summary = 'Changer la position d\'une adresse favorite'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de l\'adresse favorite'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Nouvelle position',
      required: true,
      schema: {
        type: "object",
        required: ["position"],
        properties: {
          position: { type: "integer", example: 2 }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Position mise à jour',
      schema: {
        _id: "507f1f77bcf86cd799439011",
        position: 2
      }
    }
    #swagger.responses[404] = {
      description: 'Adresse non trouvée',
      schema: { error: 'Favorite not found or forbidden' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  controller.updateFavoritePosition
);

module.exports = router;
