const express = require("express");
const router = express.Router();
const { upload } = require("../utils");
const { authenticateToken } = require("../middlewares/authMiddleware");
const maintainController = require("../controllers/maintainController");

router.post(
  "/",
  /* 
    #swagger.tags = ['Maintains']
    #swagger.summary = Créer un nouveau type de maintenance
    #swagger.description = Endpoint pour créer un nouveau type de maintenance
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données du type de maintenance',
      required: true,
      schema: {
        type: 'object',
        required: ['name', 'description', 'periodicity'],
        properties: {
          name: { type: 'string', example: 'Vidange moteur' },
          description: { type: 'string', example: 'Changement d\'huile moteur' },
          periodicity: {
            type: 'object',
            properties: {
              km: { type: 'number', example: 10000 },
              days: { type: 'number', example: 365 }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Type de maintenance créé avec succès',
      schema: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          name: 'Vidange moteur',
          description: 'Changement d\'huile moteur',
          periodicity: { km: 10000, days: 365 }
        },
        message: 'Maintenance created successfully'
      }
    }
    #swagger.responses[400] = {
      description: 'Données invalides',
      schema: { success: false, message: 'Données de maintenance invalides' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  maintainController.createMaintain
);

router.get(
  "/",
  /* 
    #swagger.tags = ['Maintains']
    #swagger.summary = Récupérer la liste des types de maintenance
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['vehicleId'] = {
      in: 'query',
      type: 'string',
      description: 'ID du véhicule pour calculer l\'usure'
    }
    #swagger.parameters['query'] = {
      in: 'query',
      type: 'string',
      description: 'Filtre par nom, description ou notes (format: name:vidange,description:moteur)'
    }
    #swagger.responses[200] = {
      description: 'Liste des maintenances récupérée avec succès',
      schema: {
        success: true,
        data: [{
          _id: '507f1f77bcf86cd799439011',
          name: 'Vidange moteur',
          description: 'Changement d\'huile moteur',
          periodicity: { km: 10000, days: 365 },
          wearPercentage: 75
        }],
        message: 'Maintenances retrieved successfully'
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  maintainController.getMaintains
);

router.get(
  "/:id",
  /* 
    #swagger.tags = ['Maintains']
    #swagger.summary = Récupérer un type de maintenance par ID
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du type de maintenance'
    }
    #swagger.responses[200] = {
      description: 'Type de maintenance trouvé',
      schema: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          name: 'Vidange moteur',
          description: 'Changement d\'huile moteur',
          periodicity: { km: 10000, days: 365 }
        },
        message: 'Maintenance retrieved successfully'
      }
    }
    #swagger.responses[404] = {
      description: 'Type de maintenance non trouvé',
      schema: { success: false, message: 'Maintenance not found' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  maintainController.getMaintainById
);

router.post(
  "/count",
  /* 
    #swagger.tags = ['Maintains']
    #swagger.summary = Obtenir le nombre de maintenances en attente par véhicule
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Liste des IDs de véhicules',
      required: true,
      schema: {
        type: 'object',
        required: ['vehicleIds'],
        properties: {
          vehicleIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Nombre de maintenances en attente',
      schema: [{
        vehicleId: '507f1f77bcf86cd799439011',
        pendingMaintenances: 3
      }]
    }
    #swagger.responses[400] = {
      description: 'Données invalides',
      schema: { error: 'vehicleIds must be an array' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  maintainController.getMaintenanceCount
);

router.put(
  "/:id",
  /* 
    #swagger.tags = ['Maintains']
    #swagger.summary = Mettre à jour un type de maintenance
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du type de maintenance'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données à mettre à jour',
      required: true,
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Vidange moteur modifiée' },
          description: { type: 'string', example: 'Description mise à jour' },
          periodicity: {
            type: 'object',
            properties: {
              km: { type: 'number', example: 15000 },
              days: { type: 'number', example: 400 }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Type de maintenance mis à jour',
      schema: {
        success: true,
        data: {
          _id: '507f1f77bcf86cd799439011',
          name: 'Vidange moteur modifiée',
          description: 'Description mise à jour'
        },
        message: 'Maintenance updated successfully'
      }
    }
    #swagger.responses[404] = {
      description: 'Type de maintenance non trouvé',
      schema: { success: false, message: 'Maintenance not found' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  maintainController.updateMaintain
);

router.delete(
  "/:id",
  /* 
    #swagger.tags = ['Maintains']
    #swagger.summary = Supprimer un type de maintenance
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID du type de maintenance'
    }
    #swagger.responses[200] = {
      description: 'Type de maintenance supprimé',
      schema: { success: true, message: 'Maintenance deleted successfully' }
    }
    #swagger.responses[404] = {
      description: 'Type de maintenance non trouvé',
      schema: { success: false, message: 'Maintenance not found' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  maintainController.deleteMaintain
);

module.exports = router;
