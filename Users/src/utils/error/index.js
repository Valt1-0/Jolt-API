const statusCodes = require("./statusCodes");
const errors = require("./errors");

module.exports = {
  ...statusCodes,
  ...errors,
};
