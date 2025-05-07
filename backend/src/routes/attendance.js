import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = Router();

export default (app) => {
    app.use('/attendance', router);

    router.get('/my', AuthMiddleware.isAuthorized, AttendanceController.getMyAttendanceStatistics);

    router.get('/', AuthMiddleware.isAuthorized,AuthMiddleware.hasRole(['admin']), AttendanceController.getAttendanceStatistics);

    router.post('/masuk', AuthMiddleware.isAuthorized, AttendanceController.absenMasuk);

    router.post('/izin', AuthMiddleware.isAuthorized, AttendanceController.absenIzin);

    router.post('/alpha', AuthMiddleware.isAuthorized, AttendanceController.markAlphaAttendance);
};