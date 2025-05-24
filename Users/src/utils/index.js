const error = require("./error");
const success = require("./success");
const redisClient = require("./Redis");
module.exports = {
  ...error,
  ...success,
  redisClient,
};
