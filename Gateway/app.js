 
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const app = express();

// Middlewares globaux
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Proxy vers les microservices (remplacez les URL par celles de vos load balancers ou services)
app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:5002", // Auth service
    changeOrigin: true,
  })
);
app.use(
  "/users",
  createProxyMiddleware({
    target: "http://localhost:5003", // Users service
    changeOrigin: true,
  })
);
app.use(
  "/vehicle",
  createProxyMiddleware({
    target: "http://localhost:5004", // Vehicle service
    changeOrigin: true,
  })
);
app.use(
  "/maintain",
  createProxyMiddleware({
    target: "http://localhost:5005",
    changeOrigin: true,
  })
);
app.use(
  "/maintainHistory",
  createProxyMiddleware({
    target: "http://localhost:5005",
    changeOrigin: true,
  })
);
app.use(
  "/mail",
  createProxyMiddleware({
    target: "http:/localhost:5001",
    changeOrigin: true,
  })
);

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});
