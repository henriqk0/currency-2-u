import Redis, { RedisOptions } from 'ioredis'

export const redisConnectionDev: { connection: RedisOptions} = {
  connection: {
    host: 'redis',
    port: 6379,
  }
};

const redisURL: string = process.env.REDIS_URL! || 'redis://redis:6379'

export const redisConnectionProd = new Redis(redisURL as string, {
  maxRetriesPerRequest: null,
});