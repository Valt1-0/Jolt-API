const express = require("express");
require("dotenv").config();

const mailRoutes = require("./src/routes/mailRoutes");

const API_PORT =
  process.env.API_PORT || console.log("No port defined in .env file");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const startServer = async () => {
  try {
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ type: "application/json" }));

    // Routes
    app.use("/mail", mailRoutes);

    // Server listening
    app.listen(API_PORT, () => {
      console.log(`Server Mail running on port ${API_PORT}`);
    });

    return app;
  } catch (error) {
    console.error(error);
  }
};

startServer();

module.exports = startServer;
