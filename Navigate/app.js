require("./src/db/mongoConnect").connect();
const express = require("express");
const http = require("http");
//const csrf = require("csrf");
const cookieParser = require("cookie-parser");
const config = require("./src/Config");
const navigateRoutes = require("./src/routes/NavigateRoutes");
const FavoriteAddressRoutes = require("./src/routes/FavoriteAddressRoutes"); // Assuming you have a FavoriteAddressRoutes.js file
const API_PORT = config.API_PORT || console.log("No port defined in .env file");

const cors = require("cors");
const bodyParser = require("body-parser");
const { handleErrorWithLogger } = require("./src/utils");
const app = express();
const userProjectionQueue = require("./src/routes/UserProjectionRoutes");
const path = require("path");

const startServer = async () => {
  try {
    //  app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ type: "application/json" }));

    // Queue
    userProjectionQueue();
    // Routes

    app.use("/navigate", navigateRoutes);
    app.use("/favorite-addresses", FavoriteAddressRoutes); // Assuming you have a FavoriteAddressRoutes.js file

    // Error handling middleware
    app.use(handleErrorWithLogger);



    const server = http.createServer(app);
    require("./src/socket")(server);
    
    server.listen(5006, () => {
      console.log("Maintain service running on port 5006");
    });

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
