import { Router } from 'express';
import { ClassController } from '../controllers/class.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = Router();

export default (app) => {
  app.use('/classes', router);

  router.post('/', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), ClassController.createClass);

  router.post('/join',AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['siswa']), ClassController.joinClass);
};