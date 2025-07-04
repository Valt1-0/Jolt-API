const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const { upload } = require("../utils");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get(
  "/",
  /* 
    #swagger.tags = ['Vehicle']
    #swagger.summary = 'Récupérer la liste des véhicules'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['userId'] = {
      in: 'query',
      type: 'string',
      description: 'ID de l\'utilisateur (admin/pro seulement)'
    }
    #swagger.responses[200] = {
      description: 'Liste des véhicules récupérée avec succès',
      schema: {
        success: true,
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            brand: 'Tesla',
            model: 'Model 3',
            year: 2023,
            mileage: 1234,
            imageUrl: 'http://localhost:5000/uploads/vehicles/image.jpg',
            owner: '507f1f77bcf86cd799439012'
          }
        ],
        message: 'Véhicules récupérés avec succès'
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
    #swagger.responses[403] = {
      description: 'Accès interdit',
      schema: { success: false, message: 'Vous n\'avez pas le droit d\'accéder à ces véhicules' }
    }
  */
  authenticateToken,
  vehicleController.getAllVehicles
);

router.get(
  "/:id",
  /* 
    #swagger.tags = ['Vehicle']
    #swagger.summary = 'Récupérer un véhicule par ID'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du véhicule'
    }
    #swagger.responses[200] = {
      description: 'Véhicule trouvé',
      schema: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          brand: 'Tesla',
          model: 'Model 3',
          year: 2023,
          mileage: 1234,
          imageUrl: 'http://localhost:5000/uploads/vehicles/image.jpg',
          owner: '507f1f77bcf86cd799439012'
        },
        message: 'Véhicule récupéré avec succès'
      }
    }
    #swagger.responses[404] = {
      description: 'Véhicule non trouvé',
      schema: { success: false, message: 'Véhicule introuvable' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  vehicleController.getVehicleById
);

router.post(
  "/",
  /* 
    #swagger.tags = ['Vehicle']
    #swagger.summary = 'Créer un nouveau véhicule'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['brand'] = {
      in: 'formData',
      required: true,
      type: 'string',
      description: 'Marque du véhicule'
    }
    #swagger.parameters['model'] = {
      in: 'formData',
      required: true,
      type: 'string',
      description: 'Modèle du véhicule'
    }
    #swagger.parameters['year'] = {
      in: 'formData',
      required: true,
      type: 'integer',
      description: 'Année du véhicule'
    }
    #swagger.parameters['mileage'] = {
      in: 'formData',
      required: true,
      type: 'integer',
      description: 'Kilométrage du véhicule'
    }
    #swagger.parameters['firstPurchaseDate'] = {
      in: 'formData',
      type: 'string',
      format: 'date',
      description: 'Date d\'achat du véhicule'
    }
    #swagger.parameters['image'] = {
      in: 'formData',
      type: 'file',
      description: 'Image du véhicule'
    }
    #swagger.responses[201] = {
      description: 'Véhicule créé avec succès',
      schema: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          brand: 'Tesla',
          model: 'Model 3',
          year: 2023,
          mileage: 1234,
          imageUrl: 'http://localhost:5000/uploads/vehicles/image.jpg',
          owner: '507f1f77bcf86cd799439012'
        },
        message: 'Véhicule créé avec succès'
      }
    }
    #swagger.responses[400] = {
      description: 'Données invalides',
      schema: { success: false, message: 'Données du véhicule invalides' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  upload.single("image"),
  vehicleController.createVehicle
);

router.put(
  "/:id",
  /* 
    #swagger.tags = ['Vehicle']
    #swagger.summary = 'Mettre à jour un véhicule'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du véhicule'
    }
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['brand'] = {
      in: 'formData',
      type: 'string',
      description: 'Marque du véhicule'
    }
    #swagger.parameters['model'] = {
      in: 'formData',
      type: 'string',
      description: 'Modèle du véhicule'
    }
    #swagger.parameters['year'] = {
      in: 'formData',
      type: 'integer',
      description: 'Année du véhicule'
    }
    #swagger.parameters['mileage'] = {
      in: 'formData',
      type: 'integer',
      description: 'Kilométrage du véhicule'
    }
    #swagger.parameters['image'] = {
      in: 'formData',
      type: 'file',
      description: 'Nouvelle image du véhicule'
    }
    #swagger.responses[200] = {
      description: 'Véhicule mis à jour avec succès',
      schema: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          brand: 'Tesla',
          model: 'Model 3',
          year: 2023,
          mileage: 1234,
          imageUrl: 'http://localhost:5000/uploads/vehicles/image.jpg',
          owner: '507f1f77bcf86cd799439012'
        },
        message: 'Véhicule mis à jour avec succès'
      }
    }
    #swagger.responses[404] = {
      description: 'Véhicule non trouvé',
      schema: { success: false, message: 'Véhicule introuvable' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
    #swagger.responses[403] = {
      description: 'Accès interdit',
      schema: { success: false, message: 'Vous n\'êtes pas autorisé à modifier ce véhicule' }
    }
  */
  authenticateToken,
  upload.single("image"),
  vehicleController.updateVehicle
);

router.patch(
  "/:id/mileage",
  /* 
    #swagger.tags = ['Vehicle']
    #swagger.summary = 'Mettre à jour le kilométrage d\'un véhicule'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du véhicule'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Nouveau kilométrage',
      required: true,
      schema: {
        type: 'object',
        required: ['mileage'],
        properties: {
          mileage: { type: 'number', example: 15000 }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Kilométrage mis à jour avec succès',
      schema: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          mileage: 15000
        },
        message: 'Kilométrage mis à jour avec succès'
      }
    }
    #swagger.responses[400] = {
      description: 'Données invalides',
      schema: { success: false, message: 'mileage must be a number' }
    }
    #swagger.responses[404] = {
      description: 'Véhicule non trouvé',
      schema: { success: false, message: 'Véhicule introuvable' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  vehicleController.updateVehicleMileage
);

router.patch(
  "/:id/favorite",
  /* 
    #swagger.tags = ['Vehicle']
    #swagger.summary = 'Définir un véhicule comme favori'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du véhicule'
    }
    #swagger.responses[200] = {
      description: 'Véhicule favori défini avec succès',
      schema: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          isFavorite: true
        },
        message: 'Véhicule favori mis à jour avec succès'
      }
    }
    #swagger.responses[404] = {
      description: 'Véhicule non trouvé',
      schema: { success: false, message: 'Véhicule introuvable' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  vehicleController.setFavoriteVehicle
);

router.delete(
  "/:id",
  /* 
    #swagger.tags = ['Vehicle']
    #swagger.summary = 'Supprimer un véhicule'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du véhicule'
    }
    #swagger.responses[200] = {
      description: 'Véhicule supprimé avec succès',
      schema: { success: true, message: 'Véhicule supprimé avec succès' }
    }
    #swagger.responses[404] = {
      description: 'Véhicule non trouvé',
      schema: { success: false, message: 'Véhicule introuvable' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
    #swagger.responses[403] = {
      description: 'Accès interdit',
      schema: { success: false, message: 'Vous n\'êtes pas autorisé à supprimer ce véhicule' }
    }
  */
  authenticateToken,
  vehicleController.deleteVehicle
);

module.exports = router;
