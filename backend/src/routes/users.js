import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { AuthMiddleware } from '../middlewares/auth.js';
import { UserValidation } from '../middlewares/validation/user.js';
import { upload } from '../middlewares/upload.js';

export default (app) => {
    const router = Router();
    
    app.use('/users', router);
    
    router.get(
        '/statistics',
        UserController.getStatistics
    );

    router.get(
        '/me',
        AuthMiddleware.isAuthorized,
        UserController.getCurrentUser
    );

    router.patch(
        '/me',
        AuthMiddleware.isAuthorized,
        upload.single('photo'),
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
    
    router.get(
        '/new-tutors',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole('admin'),
        UserController.getNewTutors
    );

    router.get(
        '/:id',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole('admin'),
        UserController.getUserById
    );

    router.patch(
        '/:id',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole('admin'),
        UserController.updateUserById
    );

    router.delete(
        '/:id',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole('admin'),
        UserController.deleteUser
    );
};
