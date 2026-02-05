import { createClient, RedisClientType } from "redis";
import { envVars } from "./env";

export const redisClient: RedisClientType = createClient({
  username: envVars.REDIS.REDIS_USERNAME,
  password: envVars.REDIS.REDIS_PASSWORD,
  socket: {
    host: envVars.REDIS.REDIS_HOST,
    port: Number(envVars.REDIS.REDIS_PORT),
  },
});

// export const redisClient = createClient({
//   url: envVars.REDIS.REDIS_URL,
//   socket: {
//     tls: true,
//     servername: "redis-18108.c14.us-east-1-2.ec2.cloud.redislabs.com",
//     rejectUnauthorized: true,
//   },
// });

redisClient.on("error", (err) => console.log("Redis Client Error", err));

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

export const connectToRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("✅ Redis DB Connection Successful");
  }
};
