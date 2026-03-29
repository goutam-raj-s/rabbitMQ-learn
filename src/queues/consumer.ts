import * as amqp from 'amqplib';

export class Consumer {
    private static connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
    private static channel: amqp.Channel | null = null;

    private static async initialize(): Promise<void> {
        if (!this.connection) {
            const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
            this.connection = await amqp.connect(rabbitMqUrl);
        }
        
        if (!this.channel && this.connection) {
            this.channel = await this.connection.createChannel();
        }
    }

    public static async consumeMessages(
        queueName: string, 
        messageHandler: (message: unknown) => Promise<void>,
        limit: number = 5
    ): Promise<void> {
        try {
            await this.initialize();

            if (!this.channel) {
                throw new Error('RabbitMQ Channel was not established properly.');
            }

            await this.channel.assertQueue(queueName, {
                durable: true
            });

            // Set the prefetch limit (e.g. limit 5)
            await this.channel.prefetch(limit);

            console.log(`[*] Actively listening for messages in queue: '${queueName}' (limit: ${limit})`);

            await this.channel.consume(queueName, async (msg: amqp.ConsumeMessage | null) => {
                if (msg !== null) {
                    try {
                        const content = msg.content.toString();
                        const parsedMessage = JSON.parse(content) as unknown;

                        await messageHandler(parsedMessage);

                        this.channel?.ack(msg);
                    } catch (handlerError) {
                        console.error(`[RabbitMQ Error] Handler failed processing message:`, handlerError);
                    }
                }
            }, {
                noAck: false
            });

        } catch (error) {
            console.error(`[RabbitMQ Error] Failed initiating consumer for queue: ${queueName}`, error);
            throw error;
        }
    }
}

// Ensure OrderService can be imported
import { OrderService } from '../services/OrderService';
import { OrderRequest } from '../models/Order';

const orderService = new OrderService();

Consumer.consumeMessages('order-queue', async (message) => {
    const orderData = message as OrderRequest;
    console.log('[*] Processing order from queue:', orderData);
    try {
        await orderService.createOrder(orderData);
        console.log('[*] Order created successfully via queue');
    } catch (error) {
        console.error('[!] Failed to create order from queue:', error);
    }
}, 5);