import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';

/** @param {Router} app */
export default (app) => {
    const router = Router();

    app.use('/auth', router);

    router.post('/register', AuthController.register);

    router.post('/login', AuthController.login);

    router.post('/password-reset', AuthController.sendPasswordResetEmail);

    router.get('/password-reset/:token', AuthController.verifyPasswordResetToken);

    router.post('/password-reset/confirm', AuthController.resetPassword);

    router.post('/otp', AuthController.sendUserVerificationOtp);

    router.post('/otp/verify', AuthController.verifyUserVerificationOtp);
};