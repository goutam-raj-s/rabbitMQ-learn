import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

const router = Router();
const orderController = new OrderController();

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);

export default router;
