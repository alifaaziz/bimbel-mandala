import { Router } from 'express';
import { UserController } from '../controllers/user.js';

/** @param {Router} app */
export default (app) => {
    const router = Router();

    app.use('/users', router);

    // Create a new user
    router.post('/', UserController.createUser);

    // Get current user
    router.get('/me', UserController.getCurrentUser);

    // Update current user
    router.patch('/me', UserController.updateCurrentUser);
};
