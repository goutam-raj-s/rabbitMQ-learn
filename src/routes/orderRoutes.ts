import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';
import { RabbitMQProducer } from '../queues/RabbitMQProducer';

const router = Router();
const messageQueue = new RabbitMQProducer();
const orderService = new OrderService(messageQueue);
const orderController = new OrderController(orderService);

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);

export default router;
