const error = require("./error");
const success = require("./success");
const redisClient = require("./Redis");
const queue = require("./Queue"); 
module.exports = {
  ...error,
  ...success,
  ...queue,
  redisClient,
};
