import { Router } from 'express';
import { TutorApplicationController } from '../controllers/tutorApplication.js';
import { AuthMiddleware } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

export default (app) => {
    app.use('/apply', router);

    router.get('/', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole('admin'), TutorApplicationController.getTutorApplications);

    router.post('/', upload.single('photo'), TutorApplicationController.applyTutor);

    router.post('/verify/:id', AuthMiddleware.isAuthorized, TutorApplicationController.verifyTutor);

    router.get('/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole('admin'), TutorApplicationController.getTutorApplicationById);

    router.delete('/reject/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole('admin'), TutorApplicationController.rejectTutorApplication);
};