import { Router } from 'express';
import { ScheduleController } from '../controllers/schedule.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = Router();

export default (app) => {
  app.use('/schedules', router);

  router.post('/', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), ScheduleController.createSchedules);

  router.patch('/reschedule/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin', 'tutor']), ScheduleController.reschedule);

  router.get('/closest', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), ScheduleController.getClosestSchedules);

  router.get('/', AuthMiddleware.isAuthorized, ScheduleController.getSchedules);

  router.get('/:slug', AuthMiddleware.isAuthorized, ScheduleController.getScheduleBySlug);

  router.patch('/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin', 'tutor']), ScheduleController.updateScheduleInformation);
};