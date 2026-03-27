import * as amqp from 'amqplib';

export class Producer {
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

    public static async publishMessage(queueName: string, message: unknown): Promise<void> {
        try {
            await this.initialize();

            if (!this.channel) {
                throw new Error('RabbitMQ Channel was not established properly.');
            }

            await this.channel.assertQueue(queueName, {
                durable: true
            });

            const payload = Buffer.from(JSON.stringify(message));

            this.channel.sendToQueue(queueName, payload, {
                persistent: true
            });

            console.log(`[x] Published message properly to queue: '${queueName}'`);
        } catch (error) {
            console.error(`[RabbitMQ Error] Failed publishing to queue: ${queueName}`, error);
            throw error;
        }
    }
}

Producer.publishMessage('test-queue', { message: 'Hello World' });
