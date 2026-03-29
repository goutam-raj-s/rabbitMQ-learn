import { mqConnection } from './connectionManager';

export class Consumer {
    public static async consumeMessages(
        queueName: string, 
        messageHandler: (message: unknown) => Promise<void>,
        limit: number = 5
    ): Promise<void> {
        mqConnection.createChannel({
            setup: async (channel: any) => {
                await channel.assertQueue(queueName, { durable: true });
                await channel.prefetch(limit);
                
                console.log(`[*] Actively listening for messages in queue: '${queueName}' (limit: ${limit})`);
                
                await channel.consume(queueName, async (msg: any) => {
                    if (msg !== null) {
                        try {
                            const content = msg.content.toString();
                            const parsedMessage = JSON.parse(content);
                            
                            await messageHandler(parsedMessage);
                            
                            channel.ack(msg);
                        } catch (handlerError) {
                            console.error(`[RabbitMQ Error] Handler failed processing message:`, handlerError);
                            // To avoid endless loops on bad messages, we could also reject/nack here
                        }
                    }
                }, { noAck: false });
            }
        });
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