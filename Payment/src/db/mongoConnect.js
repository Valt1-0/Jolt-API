const mongoose = require("mongoose");
const config = require("../config");
mongoose.set("strictQuery", false);
 
const MONGODB_URI = config.MONGODB_URI;

exports.connect = async () => {
  await mongoose.connect(MONGODB_URI).catch((error) => {
    console.error(error);
    process.exit(1);
  });
};
