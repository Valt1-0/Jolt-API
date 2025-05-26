const dotEnv = require("dotenv");
dotEnv.config();

if (process.env.NODE_ENV !== "production") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
}

module.exports = {
  API_PORT: process.env.API_PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
  NODE_ENV: process.env.NODE_ENV,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  NOTIFICATION_SERVICE: process.env.NOTIFICATION_SERVICE_QUEUE,
  USER_SERVICE: process.env.USER_SERVICE_QUEUE,
  AUTH_SERVICE: process.env.AUTH_SERVICE_QUEUE,
  IMAGE_UPLOAD_PATH: process.env.IMAGE_UPLOAD_PATH,
  IMAGE_BASE_URL: process.env.IMAGE_BASE_URL,
};
