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
  "http://192.168.1.88:5000",
];

// Middlewares globaux
app.use(morgan("dev"));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Swagger docs
app.use("/api-docs", (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Proxy vers les microservices
app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:5002/auth",
    changeOrigin: true,
  })
);

app.use(
  "/users",
  createProxyMiddleware({
    target: "http://localhost:5003/users",
    changeOrigin: true,
  })
);

app.use(
  "/vehicle",
  createProxyMiddleware({
    target: "http://localhost:5004/vehicle",
    changeOrigin: true,
  })
);
/* 
#swagger.tags = ['Maintain']
#swagger.path = '/maintain'
*/
app.use(
  "/maintain",
  createProxyMiddleware({
    target: "http://localhost:5005/maintain",
    changeOrigin: true,
  })
);
/* 
#swagger.tags = ['maintainHistory']  
#swagger.path = '/maintainHistory'
*/
app.use(
  "/maintainHistory",
  createProxyMiddleware({
    target: "http://localhost:5005/maintainHistory",
    changeOrigin: true,
  })
);

app.use(
  "/pushToken",
  createProxyMiddleware({
    target: "http://localhost:5001/pushToken",
    changeOrigin: true,
  })
);

app.use(
  "/navigate",
  createProxyMiddleware({
    target: "http://localhost:5006/navigate",
    changeOrigin: true,
  })
);

app.use(
  "/favorite-addresses",
  createProxyMiddleware({
    target: "http://localhost:5006/favorite-addresses",
    changeOrigin: true,
  })
);

// Gestion des fichiers statiques
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
  console.log("API Gateway running on port 5000");
});

module.exports = app;
