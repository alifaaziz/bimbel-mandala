import { Router } from 'express';
import { ClassController } from '../controllers/class.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = Router();

export default (app) => {
  app.use('/classes', router);

  router.post('/', ClassController.createClass);
  router.post('/join',AuthMiddleware.isAuthorized, ClassController.joinClass);
};