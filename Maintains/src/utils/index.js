const error = require("./error");
const success = require("./success");
const redisClient = require("./Redis");
const upload = require("./upload");
module.exports = {
  ...error,
  ...success,
  redisClient,
  upload
};
