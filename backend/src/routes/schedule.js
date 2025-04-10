import { Router } from 'express';
import { ScheduleController } from '../controllers/schedule.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = Router();

export default (app) => {
  app.use('/schedules', router);

  router.post('/', ScheduleController.createSchedules);

  router.patch('/reschedule/:id', ScheduleController.reschedule);

  router.get('/closest', ScheduleController.getClosestSchedules);

  router.get('/', AuthMiddleware.isAuthorized, ScheduleController.getSchedules);
};