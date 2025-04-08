import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { AuthMiddleware } from '../middlewares/auth.js';
import { UserValidation } from '../middlewares/validation/user.js';

export default (app) => {
    const router = Router();

    app.use('/users', router);

    router.get(
        '/me',
        AuthMiddleware.isAuthorized,
        UserController.getCurrentUser
    );

    router.patch(
        '/me',
        AuthMiddleware.isAuthorized,
        UserValidation.isValidUserUpdatePayload,
        UserController.updateCurrentUser
    );
};
