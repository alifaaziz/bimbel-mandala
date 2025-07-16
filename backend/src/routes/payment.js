import { Router } from 'express';
import { PaymentController } from '../controllers/payment.js';
import { AuthMiddleware } from '../middlewares/auth.js';

export default (app) => {
  const router = Router();

  app.use('/payments', router);

  router.post(
    '/',
    AuthMiddleware.isAuthorized,
    AuthMiddleware.hasRole('admin'),
    PaymentController.createPayment
  );

  router.get(
    '/',
    AuthMiddleware.isAuthorized,
    PaymentController.getPayments
  );

  router.patch(
    '/:id',
    AuthMiddleware.isAuthorized,
    AuthMiddleware.hasRole('admin'),
    PaymentController.updatePayment
  );

  router.delete(
    '/:id',
    AuthMiddleware.isAuthorized,
    AuthMiddleware.hasRole('admin'),
    PaymentController.deletePayment
  );
};