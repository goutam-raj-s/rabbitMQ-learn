import { MessageQueue } from '../interfaces/MessageQueue';
import { Producer } from './producer';

export class RabbitMQProducer implements MessageQueue {
    public async publish(queue: string, message: unknown): Promise<void> {
        await Producer.publishMessage(queue, message);
    }
}
