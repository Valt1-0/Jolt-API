const mongoose = require("mongoose");
const config = require("../Config");
mongoose.set("strictQuery", false);
const MaintainsType = require("../models/maintainTypeModel");

const MONGODB_URI = config.MONGODB_URI;

exports.connect = async () => {
  await mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      console.log(
        "Successfully connected to database " + mongoose.connection.name
      );
       // Initialiser les types par défaut ici
       await MaintainsType.initDefaultTypes();
       console.log("Types de maintenance par défaut initialisés");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
