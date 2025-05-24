const { createClient } = require("redis");
const config = require("../../Config");

const redisClient = createClient({
  url: config.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));


redisClient
  .connect()
  .then(() => console.log("Redis client connected"))
  .catch((err) => console.error("Redis connection error:", err));


module.exports = redisClient;
