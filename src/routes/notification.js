import { Router } from "express";
import { NotificationController } from "../controllers/notification.js";
import { authMiddleware } from "../middlewares/auth.js";

export default (app) => {
    const router = Router();

    app.use('/notification', router);

    router.get('/', authMiddleware.isAuthorized, NotificationController.getNotifications);

    router.post('/:id', authMiddleware.isAuthorized, NotificationController.markNotificationAsRead);

    router.post('/', authMiddleware.isAuthorized, NotificationController.markAllNotificationsAsRead);

    router.delete('/:id', authMiddleware.isAuthorized, NotificationController.deleteNotification);
}