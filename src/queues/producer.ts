import { mqConnection } from './connectionManager';

export class Producer {
    private static channelWrapper = mqConnection.createChannel({
        json: true,
        setup: (channel: any) => {
            // Assert queues here if needed (could be dynamically assigned)
            // returning a promise from setup ensures it runs before sending messages
        }
    });

    public static async publishMessage(queueName: string, message: unknown): Promise<void> {
        try {
            await this.channelWrapper.assertQueue(queueName, { durable: true });
            
            await this.channelWrapper.sendToQueue(queueName, message, {
                persistent: true
            });

            console.log(`[x] Published message properly to queue: '${queueName}'`);
        } catch (error) {
            console.error(`[RabbitMQ Error] Failed publishing to queue: ${queueName}`, error);
            throw error;
        }
    }
}
