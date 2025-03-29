
import { createClient } from "redis";

const redisClient = createClient({
//   url: "redis://localhost:6379", 
  url: process.env.REDIS_CLI, 
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Connected to Redis"));

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

export default redisClient;