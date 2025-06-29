require("./src/db/mongoConnect").connect();
const express = require("express");
const http = require("http");
//const csrf = require("csrf");
const cookieParser = require("cookie-parser");
const config = require("./src/config");
const maintainRoutes = require("./src/routes/maintainRoutes");
const maintainHistoryRoutes = require("./src/routes/maintainHistoryRoutes");
const API_PORT = config.API_PORT || console.log("No port defined in .env file");

const cors = require("cors");
const bodyParser = require("body-parser");
const { handleErrorWithLogger } = require("./src/utils");
const app = express();

const startServer = async () => {
  try {
    // app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ type: "application/json" }));
    if (config.NODE_ENV !== "production")
      app.use("/uploads", express.static("uploads"));
    // Initialiser la protection CSRF
    // const csrfTokens = new csrf();

    // // Middleware pour générer un token CSRF et l'envoyer au client
    // app.use((req, res, next) => {
    //   let csrfSecret = req.cookies.csrf_secret;

    //   if (!csrfSecret) {
    //     csrfSecret = csrfTokens.secretSync();
    //     res.cookie("csrf_secret", csrfSecret, {
    //       httpOnly: true, // Protéger le secret
    //       secure: true, // Requiert HTTPS
    //       sameSite: "Strict", // Protéger contre les requêtes inter-sites
    //     });
    //   }

    //   // Générer un token basé sur le secret
    //   const csrfToken = csrfTokens.create(csrfSecret);
    //   res.cookie("csrf_token", csrfToken, {
    //     httpOnly: false, // Accessible au JavaScript côté client
    //     secure: true,
    //     sameSite: "Strict",
    //   });

    //   next();
    // });

    // Routes

    app.use("/maintain", maintainRoutes);
    app.use("/maintainHistory", maintainHistoryRoutes);

    // Error handling middleware
    app.use(handleErrorWithLogger);

    // Server listening
    app.listen(API_PORT, () => {
      console.log(`Server Users running on port ${API_PORT}`);
    });

    return app;
  } catch (error) {
    console.error(error);
  }
};

startServer();

module.exports = startServer;
