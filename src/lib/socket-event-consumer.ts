
import { consumeQueue } from './rabbitmq';
import { getIO } from './socket';

const SOCKET_EVENTS_QUEUE = 'socket_events';

type SocketEventMessage = {
    room: string;
    event: string;
    data: any;
};

export const startSocketEventConsumer = async () => {
    console.log('🔌 Starting Socket Event Consumer...');

    const connect = async () => {
        try {
            await consumeQueue(SOCKET_EVENTS_QUEUE, async (msg: SocketEventMessage) => {
                try {
                    const { room, event, data } = msg;
                    const io = getIO();

                    // Emit to the specific room
                    console.log(`📡 Emitting ${event} to room ${room}`);
                    io.to(room).emit(event, data);
                } catch (error) {
                    console.error('❌ Failed to emit socket event via consumer:', error);
                }
            });
            console.log('✅ Socket Event Consumer ready');
        } catch (err) {
            console.error('❌ Failed to start socket event consumer, retrying in 5s...', err);
            setTimeout(connect, 5000);
        }
    };

    connect();
};
