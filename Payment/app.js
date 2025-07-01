require("./src/db/mongoConnect").connect();
const express = require("express");
const http = require("http");
//const csrf = require("csrf");
const cookieParser = require("cookie-parser");
const config = require("./src/config");
const paymentRoutes = require("./src/routes/paymentRoutes");
const productRoutes = require("./src/routes/productRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const webhookRoutes = require("./src/routes/webhookRoutes");
const API_PORT = config.API_PORT || console.log("No port defined in .env file");

const cors = require("cors");
const bodyParser = require("body-parser");
const { handleErrorWithLogger } = require("./src/utils");
const app = express();
const path = require("path");

const startServer = async () => {
  try {
    // Webhook Stripe (sans auth)
    app.use("/webhook", webhookRoutes);

    //  app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ type: "application/json" }));

    // Routes

    app.use("/payment", paymentRoutes);
    app.use("/product", productRoutes);
    app.use("/subscription", subscriptionRoutes);

    // Error handling middleware
    app.use(handleErrorWithLogger);

    // const server = http.createServer(app);
    // require("./src/socket")(server);

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
