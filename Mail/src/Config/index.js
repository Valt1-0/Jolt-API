const dotEnv = require("dotenv");
dotEnv.config();

if (process.env.NODE_ENV !== "production") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
}

module.exports = {
  API_PORT: process.env.API_PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  NOTIFICATION_SERVICE: process.env.NOTIFICATION_SERVICE_QUEUE,
  USER_SERVICE: process.env.USER_SERVICE_QUEUE,
};
