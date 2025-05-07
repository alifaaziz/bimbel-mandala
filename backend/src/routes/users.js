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

    router.get(
        '/tutors',
        UserController.getTutorsSortedByClassCount
    )

    router.get(
        '/students',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole('admin'),
        UserController.getTopStudents
    );

    router.get(
        '/new-students',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole('admin'),
        UserController.getNewStudents
    );
};
