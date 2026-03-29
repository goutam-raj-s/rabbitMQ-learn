import { OrderRepository } from '../repositories/OrderRepository';
import { Order, OrderRequest } from '../models/Order';
import { MessageQueue } from '../interfaces/MessageQueue';

export class OrderService {
    private orderRepository: OrderRepository;
    private queue: MessageQueue;

    constructor(queue: MessageQueue) {
        this.orderRepository = new OrderRepository();
        this.queue = queue;
    }

    public async createOrder(orderData: OrderRequest): Promise<Order> {
        if (orderData.price <= 0 || orderData.quantity <= 0) {
            throw new Error('Quantity and price must be greater than zero.');
        }
        
        const order = await this.orderRepository.create(orderData);
        await this.queue.publish('order-queue', order);
        
        return order;
    }

    public async updateOrderStatus(id: number, status: string): Promise<void> {
        return await this.orderRepository.updateStatus(id, status);
    }

    public async getOrder(id: number): Promise<Order | null> {
        return await this.orderRepository.findById(id);
    }

    public async getAllOrders(): Promise<Order[]> {
        return await this.orderRepository.findAll();
    }
}
