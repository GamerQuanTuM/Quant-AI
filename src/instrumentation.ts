
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { healthCheck: rabbitHealthCheck } = await import('./lib/rabbitmq');
        const { healthCheck: redisHealthCheck } = await import('./lib/redis');
        const { healthCheck: postgresHealthCheck } = await import('./lib/prisma');

        await Promise.all([
            rabbitHealthCheck(),
            redisHealthCheck(),
            postgresHealthCheck()
        ]);
    }
}
