import { OrderRepository } from '../repositories/OrderRepository';
import { Order, OrderRequest } from '../models/Order';

export class OrderService {
    private orderRepository: OrderRepository;

    constructor() {
        this.orderRepository = new OrderRepository();
    }

    public async createOrder(orderData: OrderRequest): Promise<Order> {
        if (orderData.price <= 0 || orderData.quantity <= 0) {
            throw new Error('Quantity and price must be greater than zero.');
        }
        return await this.orderRepository.create(orderData);
    }

    public async getOrder(id: number): Promise<Order | null> {
        return await this.orderRepository.findById(id);
    }

    public async getAllOrders(): Promise<Order[]> {
        return await this.orderRepository.findAll();
    }
}
