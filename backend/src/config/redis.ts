export const redisConfig = {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
  }
};