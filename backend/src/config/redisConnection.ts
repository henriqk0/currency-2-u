import Redis, { RedisOptions } from 'ioredis'

const isProduction = !!process.env.REDIS_HOST


export const redisConnection: { connection: RedisOptions} = {
  // production || local, respectively 
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    maxRetriesPerRequest: null,
    ...(isProduction ? { tls: { rejectUnauthorized: true } } : {}), 
  }
};


export const redisConnection2 = new Redis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
});