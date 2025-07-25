import { Router } from "express";
import { NotificationController } from "../controllers/notification.js";
import { AuthMiddleware } from "../middlewares/auth.js";
import { CommonValidationMiddleware } from "../middlewares/validation/common.js";
import { NotificationMiddleware } from "../middlewares/notification.js";

export default (app) => {
    const router = Router();

    app.use('/notification', router);

    router.get(
        '/',
        AuthMiddleware.isAuthorized,
        NotificationController.getNotifications
    );

    router.post(
        '/:id',
        CommonValidationMiddleware.isValidParamsIdUuid,
        AuthMiddleware.isAuthorized,
        NotificationMiddleware.isNotificationExists,
        NotificationController.markNotificationAsRead
    );

    router.post(
        '/',
        AuthMiddleware.isAuthorized,
        NotificationController.markAllNotificationsAsRead
    );

    router.delete(
        '/',
        AuthMiddleware.isAuthorized,
        NotificationController.deleteNotification
    );
}