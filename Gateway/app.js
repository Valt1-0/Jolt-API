const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
// const cookieParser = require("cookie-parser");
// const bodyParser = require('body-parser')
const app = express();
  const allowedOrigins = ["http://localhost:8000", "http://localhost:5000"];
 
// Middlewares globaux
app.use(morgan("dev"));
app.use(cors({ origin: allowedOrigins, credentials: true }));
//app.use(express.json());
//app.use(cookieParser());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json({ type: "application/json" }));
app.use(helmet());

// Proxy vers les microservices (remplacez les URL par celles de vos load balancers ou services)
app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:5002/auth", // Auth service
    changeOrigin: true,
  })
);
app.use(
  "/users",
  createProxyMiddleware({
    target: "http://localhost:5003/users", // Users service
    changeOrigin: true,
  })
);
app.use(
  "/vehicle",
  createProxyMiddleware({
    target: "http://localhost:5004/vehicle", // Vehicle service
    changeOrigin: true,
  })
);
app.use(
  "/maintain",
  createProxyMiddleware({
    target: "http://localhost:5005/maintain",
    changeOrigin: true,
  })
);

app.use(
  "/maintainHistory",
  createProxyMiddleware({
    target: "http://localhost:5005/maintainHistory",
    changeOrigin: true,
  })
);
app.use(
  "/mail",
  createProxyMiddleware({
    target: "http://localhost:5001/mail",
    changeOrigin: true,
  })
);
//app.use(express.json());
app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});
