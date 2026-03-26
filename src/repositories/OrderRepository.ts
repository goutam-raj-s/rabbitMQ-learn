import { getDbConnection } from '../config/database';
import { Order, OrderRequest } from '../models/Order';

export class OrderRepository {
    public async create(orderData: OrderRequest): Promise<Order> {
        const db = await getDbConnection();
        const result = await db.run(
            `INSERT INTO orders (item, quantity, price) VALUES (?, ?, ?)`,
            [orderData.item, orderData.quantity, orderData.price]
        );
        
        return {
            id: result.lastID as number,
            item: orderData.item,
            quantity: orderData.quantity,
            price: orderData.price
        };
    }

    public async findById(id: number): Promise<Order | null> {
        const db = await getDbConnection();
        const row = await db.get<Order>(
            `SELECT * FROM orders WHERE id = ?`,
            [id]
        );
        
        return row || null;
    }

    public async findAll(): Promise<Order[]> {
        const db = await getDbConnection();
        const rows = await db.all<Order[]>(
            `SELECT * FROM orders`
        );
        
        return rows || [];
    }
}
