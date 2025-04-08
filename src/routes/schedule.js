import { Router } from 'express';
import { ScheduleController } from '../controllers/schedule.js';

const router = Router();

export default (app) => {
  app.use('/schedules', router);

  router.post('/', ScheduleController.createSchedules);
};