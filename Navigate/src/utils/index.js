const error = require("./error");
const success = require("./success");
const redisClient = require("./Redis");
const queue = require("./queue");
const upload = require("./upload");
module.exports = {
  ...error,
  ...success,
  ...queue,
  redisClient,
  upload
};
