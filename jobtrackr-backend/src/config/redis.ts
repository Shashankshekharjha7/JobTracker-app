import {Redis} from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
  retryStrategy(times: number): number {
    return Math.min(times * 50, 2000);
  },
});

redis.on("error", (err: Error) => {
  console.error("Redis error:", err.message);
});

redis.on("ready", () => {
  console.log("✅ Redis ready");
});