const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  optionalAuthenticateToken,
} = require("../middlewares/authMiddleware");
const navigationController = require("../controllers/NavigateController");
const path = require("path");

//retourne le fichier navigate.html pour ouvrir directement dans l'application
router.get(
  "/trip",
  /*
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Ouvrir la page de navigation'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'query',
      description: 'ID de la navigation',
      required: true,
      type: 'string',
      example: '685b09d9ffd2373e1d9993ab'
    }
    #swagger.responses[200] = {
      description: 'Page de navigation ouverte',
      content: {
        'text/html': {
          schema: {
            type: 'string', 
            example: '<!DOCTYPE html><html><head><title>Navigation</title></head><body>...</body></html>'
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'ID de la navigation requis',
      schema: { success: false, message: 'ID de la navigation requis' }
    }
  */

  (req, res) => {
    const tripId = req.query.id;
    if (!tripId) {
      return res
        .status(400)
        .json({ success: false, message: "ID de la navigation requis" });
    }

    res.sendFile(path.join(__dirname, "public", "navigate.html"));
  }
);
router.post(
  "/",
  /* 
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Créer une nouvelle navigation'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données de navigation',
      required: true,
      schema: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Trajet vers le travail" },
          isPublic: { type: "boolean", example: false },
          gpxPoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                lat: { type: "number", example: 48.8566 },
                lon: { type: "number", example: 2.3522 },
                alt: { type: "number", example: 35 },
                time: { type: "string", format: "date-time" },
                speed: { type: "number", example: 50 }
              }
            }
          },
          startTime: { type: "string", format: "date-time" },
          endTime: { type: "string", format: "date-time" },
          totalDistance: { type: "number", example: 15.5 },
          speedMax: { type: "number", example: 90 }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Navigation créée avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          name: "Trajet vers le travail",
          owner: "507f1f77bcf86cd799439012",
          isPublic: false,
          startLocation: {
            type: "Point",
            coordinates: [2.3522, 48.8566]
          }
        },
        message: "Navigation created successfully"
      }
    }
    #swagger.responses[400] = {
      description: 'Données invalides',
      schema: { success: false, message: 'Données de navigation invalides' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  navigationController.createNavigation
);

router.get(
  "/",
  /* 
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Récupérer toutes les navigations'
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
    #swagger.parameters['excludeSelf'] = {
      in: 'query',
      type: 'boolean',
      description: 'Exclure ses propres navigations'
    }
    #swagger.parameters['startTime'] = {
      in: 'query',
      type: 'string',
      format: 'date-time',
      description: 'Filtrer par date de début'
    }
    #swagger.responses[200] = {
      description: 'Liste des navigations',
      schema: {
        success: true,
        data: [
          {
            _id: "507f1f77bcf86cd799439011",
            name: "Trajet vers le travail",
            owner: "507f1f77bcf86cd799439012",
            isPublic: true,
            totalDistance: 15.5
          }
        ],
        message: "Navigations retrieved successfully"
      }
    }
  */
  optionalAuthenticateToken,
  navigationController.getAllNavigation
);

router.post(
  "/group",
  /* 
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Créer une navigation de groupe'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données de navigation de groupe',
      required: true,
      schema: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Sortie groupe dimanche" },
          startTime: { type: "string", format: "date-time" },
          gpxPoints: { type: "array" }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Navigation de groupe créée',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          name: "Sortie groupe dimanche",
          isGroup: true,
          groupMembers: ["507f1f77bcf86cd799439012"]
        },
        message: "Group navigation created successfully"
      }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  navigationController.createGroupNavigation
);

router.post(
  "/group/:id/join",
  /* 
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Rejoindre un groupe de navigation'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de la navigation de groupe'
    }
    #swagger.responses[200] = {
      description: 'Groupe rejoint avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          groupMembers: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
        },
        message: "Joined group navigation successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Groupe non trouvé',
      schema: { error: 'Not found or not group' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  navigationController.joinGroupNavigation
);

router.get(
  "/:id",
  /* 
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Récupérer une navigation par ID'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de la navigation'
    }
    #swagger.responses[200] = {
      description: 'Navigation trouvée',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          name: "Trajet vers le travail",
          owner: "507f1f77bcf86cd799439012",
          isPublic: true,
          isOwner: false,
          gpxPoints: [],
          notes: []
        },
        message: "Navigation retrieved successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Navigation non trouvée',
      schema: { success: false, message: 'Navigation not found' }
    }
    #swagger.responses[403] = {
      description: 'Accès interdit',
      schema: { success: false, message: 'Forbidden' }
    }
  */
  optionalAuthenticateToken,
  navigationController.getNavigationById
);

router.put(
  "/:id",
  /* 
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Mettre à jour une navigation'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de la navigation'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données à mettre à jour',
      required: true,
      schema: {
        type: "object",
        properties: {
          name: { type: "string", example: "Nouveau nom de trajet" },
          isPublic: { type: "boolean", example: true },
          gpxPoints: { type: "array" }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Navigation mise à jour',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          name: "Nouveau nom de trajet",
          isPublic: true
        },
        message: "Navigation updated successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Navigation non trouvée',
      schema: { success: false, message: 'Navigation not found' }
    }
    #swagger.responses[403] = {
      description: 'Accès interdit',
      schema: { success: false, message: 'Forbidden' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  navigationController.updateNavigation
);

router.delete(
  "/:id",
  /* 
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Supprimer une navigation'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de la navigation'
    }
    #swagger.responses[200] = {
      description: 'Navigation supprimée',
      schema: {
        success: true,
        message: "Navigation deleted successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Navigation non trouvée',
      schema: { success: false, message: 'Navigation not found' }
    }
    #swagger.responses[403] = {
      description: 'Accès interdit',
      schema: { success: false, message: 'Forbidden' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  navigationController.deleteNavigation
);

router.patch(
  "/:id/visibility",
  /* 
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Changer la visibilité d\'une navigation'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de la navigation'
    }
    #swagger.responses[200] = {
      description: 'Visibilité mise à jour',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          isPublic: true
        },
        message: "Navigation visibility updated"
      }
    }
    #swagger.responses[404] = {
      description: 'Navigation non trouvée',
      schema: { error: 'Not found' }
    }
    #swagger.responses[403] = {
      description: 'Accès interdit',
      schema: { error: 'Forbidden' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  navigationController.updateVisibility
);

router.post(
  "/:id/rate",
  /* 
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Noter une navigation publique'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'ID de la navigation'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Note à attribuer',
      required: true,
      schema: {
        type: "object",
        required: ["rating"],
        properties: {
          rating: { type: "number", minimum: 1, maximum: 5, example: 4 }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Note ajoutée avec succès',
      schema: {
        success: true,
        data: {
          _id: "507f1f77bcf86cd799439011",
          notes: [
            { user: "507f1f77bcf86cd799439012", rating: 4 }
          ]
        },
        message: "Navigation rated successfully"
      }
    }
    #swagger.responses[404] = {
      description: 'Navigation non trouvée ou non publique',
      schema: { error: 'Not found or not public' }
    }
    #swagger.responses[401] = {
      description: 'Non autorisé',
      schema: { success: false, message: 'Token d\'authentification requis' }
    }
  */
  authenticateToken,
  navigationController.rateNavigation
);

module.exports = router;
