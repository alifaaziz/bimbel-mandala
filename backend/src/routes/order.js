import { Router } from 'express';
import { OrderController } from '../controllers/order.js';
import { AuthMiddleware } from '../middlewares/auth.js';

export default (app) => {
    const router = Router();

    app.use('/orders', router);

    router.post('/', AuthMiddleware.isAuthorized, OrderController.createOrder);

    router.patch('/status', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), OrderController.updateOrderStatus);

    router.get('/', AuthMiddleware.isAuthorized,  OrderController.getPendingOrders);

    router.get('/:id', AuthMiddleware.isAuthorized, OrderController.getOrderById);

    router.delete('/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), OrderController.deleteOrder);
};