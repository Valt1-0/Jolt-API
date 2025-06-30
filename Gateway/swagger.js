const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
const fs = require("fs");

const generateServiceSwagger = async (serviceName, filePath, tag, prefix) => {
  console.log(`🔄 Génération ${serviceName}...`);

  const doc = {
    info: {
      title: `${serviceName} API`,
      version: "1.0.0",
    },
    host: "localhost:5000",
    basePath: prefix, // Préfixe pour chaque service
    schemes: ["http"],
    tags: [{ name: tag, description: `Gestion ${serviceName}` }],
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
  };

  const outputFile = `./swagger-${serviceName.toLowerCase()}.json`;

  try {
    await swaggerAutogen(outputFile, [filePath], doc);

    if (fs.existsSync(outputFile)) {
      const swaggerDoc = JSON.parse(fs.readFileSync(outputFile, "utf8"));
      console.log(
        `✅ ${serviceName}: ${
          Object.keys(swaggerDoc.paths || {}).length
        } routes générées`
      );
      return { doc: swaggerDoc, prefix, tag };
    }
  } catch (error) {
    console.error(`❌ Erreur ${serviceName}:`, error.message);
  }

  return null;
};

//  Fusion intelligente AVEC préfixes immédiats
const mergeSwaggerDocs = (serviceData) => {
  const mergedDoc = {
    openapi: "3.0.0",
    info: {
      title: "Jolt-API Gateway",
      description: "Documentation complète de l'API Jolt avec préfixes Gateway",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:5000", description: "Gateway" }],
    paths: {},
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [],
  };

  serviceData.forEach(({ doc, prefix, tag }) => {
    if (doc && doc.paths) {
      //  Ajoute IMMÉDIATEMENT le préfixe à chaque route
      Object.keys(doc.paths).forEach((path) => {
        Object.keys(doc.paths[path]).forEach((method) => {
          const route = doc.paths[path][method];
          const fullPath = `${prefix}${path}`; //  Préfixe ajouté maintenant !

          if (!mergedDoc.paths[fullPath]) {
            mergedDoc.paths[fullPath] = {};
          }
          mergedDoc.paths[fullPath][method] = route;
        });
      });

      // Ajoute les tags
      if (doc.tags) {
        mergedDoc.tags.push(...doc.tags);
      }
    }
  });

  return mergedDoc;
};

const main = async () => {
  console.log("🚀 GÉNÉRATION SWAGGER PAR SERVICE\n");

  // Configuration des services
  const services = [
    {
      name: "Auth",
      file: "../Auth/src/routes/authRoutes.js",
      tag: "Auth",
      prefix: "/auth",
    },
    {
      name: "Users",
      file: "../Users/src/routes/userRoutes.js",
      tag: "Users",
      prefix: "/users",
    },
    {
      name: "Vehicle",
      file: "../Vehicles/src/routes/vehicleRoutes.js",
      tag: "Vehicle",
      prefix: "/vehicle",
    },
    {
      name: "Maintain",
      file: "../Maintains/src/routes/MaintainRoutes.js",
      tag: "Maintain",
      prefix: "/maintain",
    },
    {
      name: "MaintainHistory",
      file: "../Maintains/src/routes/MaintainHistoryRoutes.js",
      tag: "MaintainHistory",
      prefix: "/maintainHistory",
    },
    {
      name: "PushToken",
      file: "../Notifications/src/routes/pushTokenRoutes.js",
      tag: "PushToken",
      prefix: "/pushToken",
    },
    {
      name: "Navigate",
      file: "../Navigate/src/routes/NavigateRoutes.js",
      tag: "Navigate",
      prefix: "/navigate",
    },
    {
      name: "FavoriteAddress",
      file: "../Navigate/src/routes/FavoriteAddressRoutes.js",
      tag: "FavoriteAddress", // Tag unique pour éviter les conflits
      prefix: "/favorite-addresses",
    },
  ];

  //  Génération par service
  const serviceData = [];
  for (const service of services) {
    if (fs.existsSync(service.file)) {
      const result = await generateServiceSwagger(
        service.name,
        service.file,
        service.tag,
        service.prefix
      );
      if (result) serviceData.push(result);
    } else {
      console.log(`❌ ${service.name}: fichier ${service.file} introuvable`);
    }
  }

  // Fusion finale SANS écrasement
  const finalDoc = mergeSwaggerDocs(serviceData);

  // Sauvegarde
  fs.writeFileSync("./swagger-output.json", JSON.stringify(finalDoc, null, 2));

  console.log("\n✅ GÉNÉRATION TERMINÉE !");
  console.log("\n📊 RÉSUMÉ FINAL :");

  const routesByTag = {};
  Object.keys(finalDoc.paths).forEach((path) => {
    Object.keys(finalDoc.paths[path]).forEach((method) => {
      const route = finalDoc.paths[path][method];
      if (route.tags && route.tags.length > 0) {
        const tag = route.tags[0];
        if (!routesByTag[tag]) routesByTag[tag] = [];
        routesByTag[tag].push(`${method.toUpperCase()} ${path}`);
      }
    });
  });

  Object.keys(routesByTag)
    .sort()
    .forEach((tag) => {
      console.log(`\n🏷️  ${tag} (${routesByTag[tag].length} routes):`);
      routesByTag[tag].forEach((route) => console.log(`   - ${route}`));
    });

  // Nettoyage des fichiers temporaires
  services.forEach((service) => {
    const tempFile = `./swagger-${service.name.toLowerCase()}.json`;
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  });

  console.log("\n🔥 Génération terminée !");
};

main().catch(console.error);
