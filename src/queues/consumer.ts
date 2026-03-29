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
import { Order } from '../models/Order';
import { RabbitMQProducer } from './RabbitMQProducer';

const messageQueue = new RabbitMQProducer();
const orderService = new OrderService(messageQueue);

Consumer.consumeMessages('order-queue', async (message) => {
    const orderData = message as Order;
    console.log(`[*] Processing order #${orderData.id} from queue...`);
    
    try {
        // Simulate some async processing like payment or inventory check
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mark the order as completed
        await orderService.updateOrderStatus(orderData.id, 'COMPLETED');
        console.log(`[*] Order #${orderData.id} marked as COMPLETED.`);
    } catch (error) {
        console.error(`[!] Failed to process order #${orderData.id}:`, error);
        // If it fails, mark as FAILED
        await orderService.updateOrderStatus(orderData.id, 'FAILED');
    }
}, 5);