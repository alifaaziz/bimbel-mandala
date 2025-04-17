import { Router } from 'express';
import { TutorApplicationController } from '../controllers/tutorApplication.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = Router();

export default (app) => {
    app.use('/apply', router);

    router.post('/', TutorApplicationController.applyTutor);

    router.post('/verify/:id', AuthMiddleware.isAuthorized, TutorApplicationController.verifyTutor);
};