const mongoose = require("mongoose");
const config = require("../Config");
mongoose.set("strictQuery", false);
const MaintainsType = require("../models/maintainTypeModel");

const MONGODB_URI = config.MONGODB_URI;

exports.connect = async () => {
  await mongoose
    .connect(MONGODB_URI)
    .then(async () => {
       // Initialiser les types par défaut ici
       await MaintainsType.initDefaultTypes(); 
    })
    .catch((error) => { 
      console.error(error);
      process.exit(1);
    });
};
