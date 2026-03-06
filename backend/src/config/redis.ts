import { RedisOptions } from 'ioredis'

const isProduction = !!process.env.REDIS_HOST

export const redisConfig: { connection: RedisOptions} = {
  // production || local, respectively 
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    ...(isProduction ? { tls: { rejectUnauthorized: true } } : {}), 
  }
};