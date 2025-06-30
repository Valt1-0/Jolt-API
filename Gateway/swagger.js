const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Jolt-API",
    description: "Documentation de l’API Jolt (microservices)",
    version: "1.0.0",
  },
  host: "localhost:5000",
  basePath: "/",
  schemes: ["http"],
  tags: [
    { name: "Auth", description: "Authentification" },
    { name: "Users", description: "Gestion des utilisateurs" },
    { name: "Vehicles", description: "Gestion des véhicules" },
    { name: "Maintains", description: "Gestion des maintenances" },
    { name: "Notifications", description: "Notifications" },
    { name: "Navigate", description: "Navigation" },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description:
        "Token d'authentification (Bearer <token>) ou dans les cookies",
    },
  },
  definitions: {
    SuccessResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: true },
        data: { type: "object" },
        message: { type: "string" },
      },
    },
    ErrorResponse: {
      type: "object",
      properties: {
        success: { type: "boolean", example: false },
        message: { type: "string" },
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./app.js",
  "../Auth/src/routes/authRoutes.js",
  "../Users/src/routes/userRoutes.js",
  "../Vehicles/src/routes/vehicleRoutes.js",
  "../Maintains/src/routes/maintainRoutes.js",
  "../Maintains/src/routes/maintainHistoryRoutes.js",
  "../Notifications/src/routes/pushTokenRoutes.js",
  "../Navigate/src/routes/NavigateRoutes.js",
  "../Navigate/src/routes/FavoriteAddressRoutes.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
