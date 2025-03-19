import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { authMiddleware } from '../middlewares/auth.js';

export default (app) => {
    const router = Router();

    app.use('/users', router);

    router.get('/me',  authMiddleware.isAuthorized, UserController.getCurrentUser);

    router.patch('/me', authMiddleware.isAuthorized, UserController.updateCurrentUser);
};
