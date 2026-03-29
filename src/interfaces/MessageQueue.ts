export interface MessageQueue {
    publish(queue: string, message: unknown): Promise<void>;
}
