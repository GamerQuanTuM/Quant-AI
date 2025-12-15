import Redis from 'ioredis';

const globalForRedis = global as unknown as { redis: Redis | undefined };

export const redis =
    globalForRedis.redis ??
    new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

if (process.env.NODE_ENV !== 'production') {
    globalForRedis.redis = redis;
}

export const healthCheck = async (): Promise<boolean> => {
    try {
        console.log('Performing Redis health check...');
        const pong = await redis.ping();
        if (pong === 'PONG') {
            console.log('Redis health check passed');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Redis health check failed:', error);
        return false;
    }
};

export default redis;
