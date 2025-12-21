import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { healthCheck as redisHealth } from "@/lib/redis";
import { healthCheck as rabbitMQHealth } from "@/lib/rabbitmq";

export const dynamic = 'force-dynamic';

export async function GET() {
    const healthStatus = {
        database: false,
        redis: false,
        rabbitmq: false,
    };

    try {
        // Check Database
        await prisma.$queryRaw`SELECT 1`;
        healthStatus.database = true;
    } catch (e) {
        console.error("Health Check: Database Check Failed", e);
    }

    try {
        // Check Redis
        healthStatus.redis = await redisHealth();
    } catch (e) {
        console.error("Health Check: Redis Check Failed", e);
    }

    try {
        // Check RabbitMQ
        healthStatus.rabbitmq = await rabbitMQHealth();
    } catch (e) {
        console.error("Health Check: RabbitMQ Check Failed", e);
    }

    const allHealthy = Object.values(healthStatus).every((status) => status);

    if (allHealthy) {
        return NextResponse.json(
            { status: "ok", services: healthStatus, timestamp: new Date().toISOString() },
            { status: 200 }
        );
    } else {
        return NextResponse.json(
            { status: "error", services: healthStatus, timestamp: new Date().toISOString() },
            { status: 503 }
        );
    }
}
