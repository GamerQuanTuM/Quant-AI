import { consumeQueue, publishToQueue } from './rabbitmq';
import { prisma } from '@/lib/prisma';
import z from 'zod';
import validate from './zod-validate';

const NOTIFICATION_QUEUE = 'notifications';


const messageSchema = z.object({
    userId: z.string(),
    type: z.string(),
    message: z.string(),
    actor: z.string().optional(),
    actorId: z.string().optional(),
    metadata: z.any().optional(),
});

type Message = z.infer<typeof messageSchema>;

export const startNotificationConsumer = async () => {
    console.log('🔄 Starting notification consumer service...');

    try {
        await consumeQueue(NOTIFICATION_QUEUE, async (msg: Message) => {
            try {

                const { userId, type, message, actor, actorId, metadata } = validate(messageSchema, msg);

                if (!userId || !message) {
                    console.error('⚠️ Invalid notification message missing userId or message:', msg);
                    return;
                }

                const notification = await prisma.notification.create({
                    data: {
                        userId,
                        type,
                        message,
                        actor,
                        actorId,
                        metadata: metadata || {},
                        read: false,
                    }
                });

                // 2. Queue Socket Emission (Back to Web Server)
                try {
                    await publishToQueue('socket_events', {
                        room: `user:${userId}`,
                        event: 'notification',
                        data: notification
                    });
                    console.log(`📤 Queued socket event for user:${userId}`);
                } catch (queueError) {
                    console.error('⚠️ Failed to queue socket event:', queueError);
                }

            } catch (error) {
                console.error('❌ Error processing notification message inside consumer:', error);
                throw error;
            }
        });
        console.log('✅ Notification consumer started successfully.');
    } catch (err) {
        console.error('❌ Failed to start notification consumer:', err);
    }
};
