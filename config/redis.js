import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST;
const redisPassword = process.env.REDIS_PASSWORD;
const redisPort = process.env.REDIS_PORT;

if (!redisPassword || !redisHost|| !redisPort) {
  console.error("Environment redis not complete.");
}

const redis = new Redis(`rediss://:${redisPassword}@${redisHost}:${redisPort}`);

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("[ioredis] Error:", err);
});

export default redis;