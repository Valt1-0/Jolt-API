const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const app = express();
const allowedOrigins = [
  "http://localhost:8000",
  "http://localhost:5000", 
  "http://192.168.1.88",
];

// Middlewares globaux
app.use(morgan("dev"));
app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origin (ex: curl, mobile) ou si l'origin est dans la liste
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(helmet());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// Proxy vers les microservices
app.use(
  "/auth",
  /* 
    #swagger.tags = ['Auth']
    #swagger.summary = 'Routes d’authentification'
  */
  createProxyMiddleware({
    target: "http://localhost:5002/auth", // Auth service
    changeOrigin: true,
  })
);
app.use(
  "/users",
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Routes des utilisateurs'
  */
  createProxyMiddleware({
    target: "http://localhost:5003/users", // Users service
    changeOrigin: true,
  })
);

app.use(
  "/vehicle",
  /* 
    #swagger.tags = ['Vehicle']
    #swagger.summary = 'Routes des véhicules'
  */
  createProxyMiddleware({
    target: "http://localhost:5004/vehicle", // Vehicle service
    changeOrigin: true,
  })
);
app.use(
  "/maintain",
  /* 
    #swagger.tags = ['Maintain']
    #swagger.summary = 'Routes de maintenance'
  */
  createProxyMiddleware({
    target: "http://localhost:5005/maintain",
    changeOrigin: true,
  })
);

app.get("/uploads/maintains/:filename", (req, res) => {
  const { filename } = req.params;
  const options = {
    hostname: "localhost",
    port: 5005,
    path: `/uploads/maintains/${filename}`,
    method: "GET",
  };

  const proxyReq = http.request(options, (proxyRes) => {
    if (proxyRes.statusCode !== 200) {
      res.status(proxyRes.statusCode).send("Fichier non trouvé");
      return;
    }

    res.writeHead(proxyRes.statusCode, proxyRes.headers);

    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("Erreur proxy fichier:", err);
    res.status(500).send("Erreur serveur");
  });

  proxyReq.end();
});

app.listen(5000, () => {
  console.log("Gateway en écoute sur le port 5000");
});

app.use(
  "/maintainHistory",
  /* 
    #swagger.tags = ['MaintainHistory']
    #swagger.summary = 'Routes de l’historique de maintenance'
  */
  createProxyMiddleware({
    target: "http://localhost:5005/maintainHistory",
    changeOrigin: true,
  })
);
app.use(
  "/pushToken",
  /* 
    #swagger.tags = ['PushToken']
    #swagger.summary = 'Routes de gestion des tokens de push'
  */
  createProxyMiddleware({
    target: "http://localhost:5001/pushToken",
    changeOrigin: true,
  })
);

// app.use("/navigate", (req, res, next) => {
//   res.setHeader(
//     "Cache-Control",
//     "no-store, no-cache, must-revalidate, proxy-revalidate"
//   );
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//  // res.removeHeader("ETag");
//   next();
// });

app.use(
  "/navigate",
  /* 
    #swagger.tags = ['Navigate']
    #swagger.summary = 'Routes de navigation'
  */
  createProxyMiddleware({
    target: "http://localhost:5006/navigate", // Navigate service
    changeOrigin: true,
  })
);
app.use("/favorite-addressese", (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use(
  "/favorite-addresses",
  /* 
    #swagger.tags = ['FavoriteAddresses']
    #swagger.summary = 'Routes des adresses favorites'
  */
  createProxyMiddleware({
    target: "http://localhost:5006/favorite-addresses", // Favorite addresses service
    changeOrigin: true,
  })
);
//app.use(express.json());
app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});
