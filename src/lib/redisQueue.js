const dotenv = require("dotenv");

dotenv.config();

export const redisStore = {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 0, // <-- this seems to prevent retries and allow for try/catch
    retryStrategy: function (times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    connectTimeout: 300000,
  },
};
