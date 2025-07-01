const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post(
  "/",
  /* 
    #swagger.tags = ['Webhook']
    #swagger.summary = 'Webhook Stripe'
    #swagger.description = 'Gère les événements webhook de Stripe (paiements, abonnements, etc.)'
    #swagger.consumes = ['application/json']
    #swagger.parameters['stripe-signature'] = {
      in: 'header',
      description: 'Signature Stripe pour vérifier l authenticité du webhook',
      required: true,
      type: 'string',
      example: 't=1492774577,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Données de l événement Stripe',
      required: true,
      schema: {
        type: "object",
        properties: {
          id: { type: "string", example: "evt_1J2Y3Z4A5B6C7D8E9F0G1H2I3J" },
          object: { type: "string", example: "event" },
          type: { 
            type: "string", 
            enum: ["checkout.session.completed", "payment_intent.succeeded", "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"],
            example: "checkout.session.completed" 
          },
          data: {
            type: "object",
            properties: {
              object: { type: "object", description: "Objet de l événement (session, subscription, etc.)" }
            }
          },
          created: { type: "integer", example: 1492774577 },
          livemode: { type: "boolean", example: false }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Webhook traité avec succès',
      schema: {
        received: true
      }
    }
    #swagger.responses[400] = {
      description: 'Erreur de traitement du webhook',
      schema: {
        error: "Invalid signature"
      }
    }
    #swagger.responses[500] = {
      description: 'Erreur serveur interne',
      schema: {
        error: "Internal server error"
      }
    }
  */
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhook
);

module.exports = router;
