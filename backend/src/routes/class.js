import { Router } from 'express';
import { ClassController } from '../controllers/class.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = Router();

export default (app) => {
  app.use('/classes', router);

  router.get('/my', AuthMiddleware.isAuthorized, ClassController.getMyClass);

  router.post('/', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), ClassController.createClass);

  router.post('/join',AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['siswa']), ClassController.joinClass);

  router.get('/running', AuthMiddleware.isAuthorized, ClassController.getRunningClass);

  router.get('/student/:userId', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), ClassController.getStudentClassesByUserId);

  router.get('/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), ClassController.getClassById);
};