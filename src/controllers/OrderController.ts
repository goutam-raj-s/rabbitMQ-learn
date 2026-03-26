import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { OrderRequest } from '../models/Order';

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    public createOrder = async (req: Request<unknown, unknown, OrderRequest>, res: Response): Promise<void> => {
        try {
            const { item, quantity, price } = req.body;

            if (!item || typeof quantity !== 'number' || typeof price !== 'number') {
                res.status(400).json({ error: 'Missing or invalid fields: item(string), quantity(number), price(number)' });
                return;
            }

            const storedOrder = await this.orderService.createOrder({ item, quantity, price });
            res.status(201).json(storedOrder);
        } catch (error) {
            const err = error as Error;
            
            if (err.message === 'Quantity and price must be greater than zero.') {
                res.status(400).json({ error: err.message });
                return;
            }

            res.status(500).json({ error: err.message });
        }
    };

    public getOrder = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid order ID' });
                return;
            }

            const order = await this.orderService.getOrder(id);

            if (!order) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }

            res.json(order);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    };

    public getAllOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            const orders = await this.orderService.getAllOrders();
            res.json(orders);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    };
}
