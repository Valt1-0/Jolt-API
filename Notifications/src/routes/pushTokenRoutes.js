const express = require("express");
const router = express.Router();
const pushTokenController = require("../controller/pushTokenController");

router.post(
  "/push-token",
  /* 
    #swagger.tags = ['PushToken']
    #swagger.summary = 'Enregistrer un token de notification push'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["expoPushToken", "deviceId"],
            properties: {
              expoPushToken: { type: "string", example: "ExponentPushToken[xxxxx]" },
              deviceId: { type: "string", example: "device123" },
              userId: { type: "string", example: "507f1f77bcf86cd799439011" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Token push enregistré avec succès',
      schema: {
        message: "Push token saved",
        token: {
          _id: "507f1f77bcf86cd799439011",
          expoPushToken: "ExponentPushToken[xxxxx]",
          deviceId: "device123",
          userId: "507f1f77bcf86cd799439012"
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Données manquantes',
      schema: { message: 'expoPushToken et deviceId sont requis' }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur',
      schema: { message: 'Error saving push token', error: 'Détail de l\'erreur' }
    }
  */
  pushTokenController.registerPushToken
);

router.post(
  "/send-push",
  /* 
    #swagger.tags = ['PushToken']
    #swagger.summary = 'Envoyer une notification push à un utilisateur'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["userId", "title", "body"],
            properties: {
              userId: { type: "string", example: "507f1f77bcf86cd799439011" },
              title: { type: "string", example: "Notification importante" },
              body: { type: "string", example: "Votre maintenance est due" },
              data: { type: "object", example: { action: "maintenance", vehicleId: "123" } }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Notification envoyée avec succès',
      schema: {
        message: "Push sent",
        tickets: []
      }
    }
    #swagger.responses[400] = {
      description: 'Données manquantes',
      schema: { message: 'Missing fields' }
    }
    #swagger.responses[404] = {
      description: 'Aucun token trouvé',
      schema: { message: 'No push tokens found for user' }
    }
    #swagger.responses[500] = {
      description: 'Erreur lors de l\'envoi',
      schema: { message: 'Error sending push', error: 'Détail de l\'erreur' }
    }
  */
  pushTokenController.sendPushToUser
);

router.post(
  "/send-push-many",
  /* 
    #swagger.tags = ['PushToken']
    #swagger.summary = 'Envoyer une notification push à plusieurs utilisateurs'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["title", "body"],
            properties: {
              userIds: {
                type: "array",
                items: { type: "string" },
                example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
              },
              toAll: { type: "boolean", example: false },
              title: { type: "string", example: "Notification de masse" },
              body: { type: "string", example: "Message pour tous les utilisateurs" },
              data: { type: "object", example: { type: "announcement" } }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Notifications envoyées avec succès',
      schema: {
        message: "Push envoyé",
        tickets: []
      }
    }
    #swagger.responses[400] = {
      description: 'Données invalides',
      schema: { message: 'userIds (array) ou toAll requis' }
    }
    #swagger.responses[404] = {
      description: 'Aucun token trouvé',
      schema: { message: 'Aucun push token trouvé' }
    }
    #swagger.responses[500] = {
      description: 'Erreur lors de l\'envoi',
      schema: { message: 'Erreur envoi push', error: 'Détail de l\'erreur' }
    }
  */
  pushTokenController.sendPushToMany
);

router.post(
  "/attach-user",
  /* 
    #swagger.tags = ['PushToken']
    #swagger.summary = 'Associer un utilisateur à un appareil'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["deviceId", "userId"],
            properties: {
              deviceId: { type: "string", example: "device123" },
              userId: { type: "string", example: "507f1f77bcf86cd799439011" }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Utilisateur associé à l\'appareil',
      schema: {
        message: "UserId attached to device",
        token: {
          _id: "507f1f77bcf86cd799439011",
          deviceId: "device123",
          userId: "507f1f77bcf86cd799439012"
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Données manquantes',
      schema: { message: 'deviceId et userId sont requis' }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur',
      schema: { message: 'Error attaching userId', error: 'Détail de l\'erreur' }
    }
  */
  pushTokenController.attachUserToDevice
);

module.exports = router;
