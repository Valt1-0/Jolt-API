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
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
  NODE_ENV: process.env.NODE_ENV,
  DEST_SERVER: process.env.DEST_SERVER,
  FILE_URL_PATH: process.env.FILE_URL_PATH,
  ACCESS_TOKEN_INSTAGRAM: process.env.ACCESS_TOKEN_INSTAGRAM,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  CLIENT_URL: process.env.CLIENT_URL,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};
