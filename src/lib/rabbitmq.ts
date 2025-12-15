import * as amqp from 'amqplib';
import { Channel } from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672';

type RabbitMQConnection = Awaited<ReturnType<typeof amqp.connect>>;

declare global {
    var rabbitConnection: RabbitMQConnection | null | undefined;
    var rabbitChannel: Channel | null | undefined;
}

let connection: RabbitMQConnection | null = null;
let channel: Channel | null = null;

export const connectToRabbitMQ = async (): Promise<{ connection: RabbitMQConnection; channel: Channel }> => {
    if (connection && channel) {
        return { connection, channel };
    }

    if (process.env.NODE_ENV === 'development') {
        if (global.rabbitConnection && global.rabbitChannel) {
            connection = global.rabbitConnection;
            channel = global.rabbitChannel;
            return { connection, channel };
        }
    }

    try {
        console.log('Connecting to RabbitMQ...');
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        console.log('Successfully connected to RabbitMQ');

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
            connection = null;
            channel = null;
            if (process.env.NODE_ENV === 'development') {
                global.rabbitConnection = null;
                global.rabbitChannel = null;
            }
        });

        connection.on('close', () => {
            console.warn('RabbitMQ connection closed');
            connection = null;
            channel = null;
            if (process.env.NODE_ENV === 'development') {
                global.rabbitConnection = null;
                global.rabbitChannel = null;
            }
        });

        if (process.env.NODE_ENV === 'development') {
            global.rabbitConnection = connection;
            global.rabbitChannel = channel;
        }

        return { connection, channel };
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }
};

export const healthCheck = async (): Promise<boolean> => {
    try {
        console.log('Performing RabbitMQ health check...');
        const { connection: conn } = await connectToRabbitMQ();
        if (conn) {
            console.log('RabbitMQ health check passed');
            return true;
        }
        return false;
    } catch (error) {
        console.error('RabbitMQ health check failed:', error);
        return false;
    }
};

export const getChannel = async (): Promise<Channel> => {
    if (!channel) {
        await connectToRabbitMQ();
    }
    if (!channel) throw new Error('RabbitMQ channel not initialized');
    return channel;
};

export const publishToQueue = async (queue: string, message: any): Promise<void> => {
    const channel = await getChannel();
    await channel.assertQueue(queue, { durable: true });

    const sent = channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
    );

    // Check if message was sent successfully
    if (!sent) {
        console.warn(`Message to queue ${queue} was not sent (buffer full)`);
    } else {
        console.log(`Message sent to queue ${queue}`);
    }
};

export const consumeQueue = async (
    queue: string,
    callback: (msg: any) => Promise<void>,
    options?: {
        prefetch?: number;
        noAck?: boolean;
        requeue?: boolean;
    }
): Promise<void> => {
    const channel = await getChannel();
    await channel.assertQueue(queue, { durable: true });

    // Set prefetch count (default: 1 message at a time)
    channel.prefetch(options?.prefetch ?? 1);

    channel.consume(queue, async (msg) => {
        if (msg) {
            try {
                const content = JSON.parse(msg.content.toString());
                await callback(content);

                // Acknowledge the message if not in noAck mode
                if (!options?.noAck) {
                    channel.ack(msg);
                }
            } catch (error) {
                console.error('Error processing message:', error);

                // Reject and optionally requeue the message
                if (!options?.noAck) {
                    channel.nack(msg, false, options?.requeue ?? false);
                }
            }
        }
    }, {
        noAck: options?.noAck ?? false
    });

    console.log(`Listening for messages on queue ${queue}`);
};


export const publishToExchange = async (
    exchange: string,
    routingKey: string,
    message: any,
    exchangeType: 'fanout' | 'topic' | 'direct' = 'topic'
): Promise<void> => {
    const channel = await getChannel();

    // Declare exchange
    await channel.assertExchange(exchange, exchangeType, {
        durable: true
    });

    // Publish message
    const published = channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
    );

    if (!published) {
        console.warn(`Message to exchange ${exchange} was not sent (buffer full)`);
    } else {
        console.log(`Published to exchange ${exchange} with routing key ${routingKey}`);
    }
};

export const subscribeToExchange = async (
    exchange: string,
    routingPattern: string,
    callback: (msg: any, routingKey: string) => Promise<void>,
    exchangeType: 'fanout' | 'topic' | 'direct' = 'topic',
    options?: {
        prefetch?: number;
        queueName?: string; // Optional: use named queue instead of exclusive
        autoDelete?: boolean;
    }
): Promise<string> => {
    const channel = await getChannel();

    // Declare exchange
    await channel.assertExchange(exchange, exchangeType, {
        durable: true
    });

    // Create queue (exclusive by default for pub/sub)
    const queueOptions = options?.queueName
        ? { durable: true, autoDelete: options?.autoDelete ?? false }
        : { exclusive: true, autoDelete: true };

    const { queue } = await channel.assertQueue(
        options?.queueName || '',
        queueOptions
    );

    // Bind queue to exchange with routing pattern
    await channel.bindQueue(queue, exchange, routingPattern);

    // Set prefetch
    channel.prefetch(options?.prefetch ?? 1);

    // Consume messages
    channel.consume(queue, async (msg) => {
        if (msg) {
            try {
                const content = JSON.parse(msg.content.toString());
                const routingKey = msg.fields.routingKey;
                await callback(content, routingKey);
                channel.ack(msg);
            } catch (error) {
                console.error('Error processing message from exchange:', error);
                channel.nack(msg, false, false);
            }
        }
    });

    console.log(`Subscribed to exchange ${exchange} with pattern ${routingPattern} on queue ${queue}`);
    return queue;
};

export const broadcast = async (exchange: string, message: any): Promise<void> => {
    await publishToExchange(exchange, '', message, 'fanout');
};

export const subscribeToBroadcast = async (
    exchange: string,
    callback: (msg: any) => Promise<void>,
    options?: { prefetch?: number }
): Promise<string> => {
    return subscribeToExchange(
        exchange,
        '',
        async (msg) => await callback(msg),
        'fanout',
        options
    );
};