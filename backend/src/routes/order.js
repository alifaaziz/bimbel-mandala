import { Router } from 'express';
import { OrderController } from '../controllers/order.js';

export default (app) => {
    const router = Router();

    app.use('/orders', router);

    router.post('/', OrderController.createOrder);

    router.patch('/status', OrderController.updateOrderStatus);

    router.get('/', OrderController.getAllOrders);

    router.get('/:id', OrderController.getOrderById);

    router.delete('/:id', OrderController.deleteOrder);
};