const error = require("./error");
const success = require("./success");
const queue = require("./Queue");
const handleAxiosError = require("./error/handleAxiosError");

module.exports = {
  ...error,
  ...success,
  ...queue,
  handleAxiosError,
};
