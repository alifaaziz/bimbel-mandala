import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.js';
import { AuthMiddleware } from '../middlewares/auth.js';
import { AttendanceValidationMiddleware } from '../middlewares/validation/attendance.js';

const router = Router();

export default (app) => {
    app.use('/attendance', router);

    router.get('/my', AuthMiddleware.isAuthorized, AttendanceController.getMyAttendanceStatistics);

    router.get('/:slug', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), AttendanceController.getAttendanceBySlug);

    router.get('/:classId', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), AttendanceController.getAttendanceStatistics);

    router.get('/alert/:classId', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), AttendanceController.getAttendanceAlerts);

    router.post('/masuk', AuthMiddleware.isAuthorized, AttendanceValidationMiddleware.isValidCreateAttendancePayload, AttendanceController.absenMasuk);

    router.post('/izin', AuthMiddleware.isAuthorized, AttendanceValidationMiddleware.isValidCreateAttendancePayload, AttendanceController.absenIzin);

    router.post('/alpha', AuthMiddleware.isAuthorized, AttendanceController.markAlphaAttendance);

    router.get('/download/:classId', AttendanceController.downloadRekapPDF);
};