
import 'dotenv/config';
import { startNotificationConsumer } from '@/lib/notification-consumer';
import { connectToRabbitMQ } from '@/lib/rabbitmq';
import { prisma } from '@/lib/prisma';

async function bootstrap() {
    console.log("👷 Notification Worker Starting...");

    // Ensure DB connection
    try {
        await prisma.$connect();
        console.log("✅ Database connected");
    } catch (e) {
        console.error("❌ Database connection failed", e);
        process.exit(1);
    }

    // Ensure RabbitMQ connection
    try {
        await connectToRabbitMQ();
        console.log("✅ RabbitMQ connected");
    } catch (e) {
        console.error("❌ RabbitMQ connection failed", e);
        process.exit(1);
    }

    // Start Consumer
    await startNotificationConsumer();
}

bootstrap().catch(err => {
    console.error("❌ Worker crashed:", err);
    process.exit(1);
});
