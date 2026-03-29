import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';

const router = Router();
const orderService = new OrderService();
const orderController = new OrderController(orderService);

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);

export default router;
