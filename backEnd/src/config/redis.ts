
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_CLI ||  "redis://localhost:6379", 
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Connected to Redis"));

(async () => {
  try {
    await redisClient.connect();
    console.log("🟢 Connection successful!");

    // Test read/write
    await redisClient.set("check", "Redis Works!");
    const val = await redisClient.get("check");
    console.log("📦 Value from Redis:", val);
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

export default redisClient;