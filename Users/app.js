require("./src/db/mongoConnect").connect();
const express = require("express");
require("dotenv").config();
const userRoute = require("./src/routes/userRoutes");
// const authRoute = require("./src/routes/authRoutes");

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
    // app.use("/auth", authRoute);
    app.use("/users", userRoute);

    // Server listening
    app.listen(API_PORT, () => {
      console.log(`Server Users running on port ${API_PORT}`);
    });

    return app;
  } catch (error) {
    console.log(error);
  }
};

startServer();

module.exports = startServer;
