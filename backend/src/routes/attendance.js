import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = Router();

export default (app) => {
    app.use('/attendance', router);

    router.post('/masuk', AuthMiddleware.isAuthorized, AttendanceController.absenMasuk);

    router.post('/izin', AuthMiddleware.isAuthorized, AttendanceController.absenIzin);
};