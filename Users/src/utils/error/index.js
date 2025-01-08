const statusCodes = require("./statusCodes");
const errors = require("./errors");
const errorHandler = require("./errorHandler");

module.exports = {
  ...statusCodes,
  ...errors,
  ...errorHandler,
};
