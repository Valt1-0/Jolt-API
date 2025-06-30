const express = require("express");
const router = express.Router();
const { upload } = require("../utils");
const { authenticateToken } = require("../middlewares/authMiddleware");

const maintainHistoryController = require("../controllers/maintainHistoryController");

router.post(
  "/",
  /* 
    #swagger.tags = ['maintainHistory']
    #swagger.summary = 'Créer un historique de maintenance'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['vehicle'] = {
      in: 'formData',
      required: true,
      type: 'string',
      description: 'ID du véhicule'
    }
    #swagger.parameters['type'] = {
      in: 'formData',
      required: true,
      type: 'string',
      description: 'ID du type de maintenance'
    }
    #swagger.parameters['date'] = {
      in: 'formData',
      required: true,
      type: 'string',
      format: 'date',
      description: 'Date de la maintenance'
    }
    #swagger.parameters['mileage'] = {
      in: 'formData',
      required: true,
      type: 'integer',
      description: 'Kilométrage au moment de la maintenance'
    }
    #swagger.parameters['cost'] = {
      in: 'formData',
      type: 'number',
      description: 'Coût de la maintenance'
    }
    #swagger.parameters['notes'] = {
      in: 'formData',
      type: 'string',
      description: 'Notes supplémentaires'
    }
    #swagger.parameters['files'] = {
      in: 'formData',
      type: 'file',
      description: 'Fichiers joints (factures, photos, etc.)'
    }
    #swagger.responses[201] = {
      description: 'Historique de maintenance créé avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          vehicle: "507f1f77bcf86cd799439012",
          type: "507f1f77bcf86cd799439013",
          date: "2025-06-30",
          mileage: 15000,
          cost: 120.50
        },
        message: "Maintenance history created successfully"
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
  upload.fields([{ name: "files", maxCount: 10 }]),
  maintainHistoryController.createMaintainHistory
);

router.get(
  "/",
  /* 
    #swagger.tags = ['maintainHistory']
    #swagger.summary = 'Récupérer l\'historique des maintenances'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['vehicle'] = {
      in: 'query',
      type: 'string',
      description: 'Filtrer par ID du véhicule'
    }
    #swagger.parameters['type'] = {
      in: 'query',
      type: 'string',
      description: 'Filtrer par type de maintenance'
    }
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
    #swagger.responses[200] = {
      description: 'Historique des maintenances récupéré avec succès',
      schema: {
        success: true,
        data: [{
          _id: "507f1f77bcf86cd799439011",
          vehicle: "507f1f77bcf86cd799439012",
          type: "507f1f77bcf86cd799439013",
          date: "2025-06-30",
          mileage: 15000,
          cost: 120.50,
          files: ["file1.pdf", "file2.jpg"]
        }],
        message: "Maintenance histories retrieved successfully"
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  maintainHistoryController.getMaintainHistories
);

router.get(
  "/:id",
  /* 
    #swagger.tags = ['maintainHistory']
    #swagger.summary = 'Récupérer un historique de maintenance par ID'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de l\'historique de maintenance'
    }
    #swagger.responses[200] = {
      description: 'Historique de maintenance trouvé',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          vehicle: "507f1f77bcf86cd799439012",
          type: "507f1f77bcf86cd799439013",
          date: "2025-06-30",
          mileage: 15000,
          cost: 120.50,
          notes: "RAS",
          files: ["file1.pdf"]
        },
        message: "Maintenance history retrieved successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Historique non trouvé',
      schema: { success: false, message: 'Maintenance history not found' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  maintainHistoryController.getMaintainHistoryById
);

router.put(
  "/:id",
  /* 
    #swagger.tags = ['maintainHistory']
    #swagger.summary = 'Mettre à jour un historique de maintenance'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de l\'historique de maintenance'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données à mettre à jour',
      required: true,
      schema: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date', example: '2025-07-01' },
          mileage: { type: 'integer', example: 16000 },
          cost: { type: 'number', example: 135.75 },
          notes: { type: 'string', example: 'Maintenance complète effectuée' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Historique de maintenance mis à jour',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          date: "2025-07-01",
          mileage: 16000,
          cost: 135.75
        },
        message: "Maintenance history updated successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Historique non trouvé',
      schema: { success: false, message: 'Maintenance history not found' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  maintainHistoryController.updateMaintainHistory
);

router.delete(
  "/:id",
  /* 
    #swagger.tags = ['maintainHistory']
    #swagger.summary = 'Supprimer un historique de maintenance'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de l\'historique de maintenance'
    }
    #swagger.responses[200] = {
      description: 'Historique de maintenance supprimé',
      schema: { success: true, message: "Maintenance history deleted successfully" }
    }
    #swagger.responses[404] = {
      description: 'Historique non trouvé',
      schema: { success: false, message: 'Maintenance history not found' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  maintainHistoryController.deleteMaintainHistory
);

module.exports = router;
