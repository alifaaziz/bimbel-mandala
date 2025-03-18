import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import passport from '../loaders/passport.js';
import { authMiddleware } from '../middlewares/auth.js';
import { UserValidation } from '../middlewares/validation/user.js';

export default (app) => {
    const router = Router();

    app.use('/auth', router);

    router.post('/register', AuthController.register);

    router.post('/login', AuthController.login);

    router.post('/add-user', AuthController.createUserWithRole);

    router.post('/password-reset', AuthController.sendPasswordResetEmail);

    router.get('/password-reset/:token', AuthController.verifyPasswordResetToken);

    router.post('/password-reset/confirm', AuthController.resetPassword);

    router.get('/otp', (_req, res) => {
        res.status(200).json({ message: 'disini tempat otp nanti' });
      });
    
    router.post('/otp', UserValidation.isUnverifiedUserExistsPayload, AuthController.sendUserVerificationOtp);

    router.post('/otp/verify', AuthController.verifyUserVerificationOtp);

    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {
            if (req.user.redirect) {
                res.redirect(req.user.redirect);
            } else {
                res.redirect('/');
            }
        }
    );
};