import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import passport from '../loaders/passport.js';
import { AuthValidationMiddleware } from '../middlewares/validation/auth.js';
import { UserValidation } from '../middlewares/validation/user.js';
import { CommonValidationMiddleware } from '../middlewares/validation/common.js';
import { OtpValidationMiddleware } from '../middlewares/validation/otp.js';

export default (app) => {
    const router = Router();

    app.use('/auth', router);

    router.post(
        '/register',
        AuthController.register
    );

    router.post(
        '/login', 
        AuthValidationMiddleware.isValidLoginPayload, 
        AuthController.login
    );

    router.post(
        '/add-user',
        AuthController.createUserWithRole
    );

    router.post(
        '/password-reset',
        CommonValidationMiddleware.isValidEmailPayload,
        AuthController.sendPasswordResetEmail
    );

    router.get(
        '/password-reset/:token',
        AuthValidationMiddleware.isValidTokenParams,
        AuthController.verifyPasswordResetToken
    );

    router.post(
        '/password-reset/confirm',
        AuthValidationMiddleware.isValidResetPasswordPayload,
        AuthController.resetPassword
    );

    router.get('/otp', (_req, res) => {
        res.status(200).json({ message: 'disini tempat otp nanti' });
      });
    
    router.post(
        '/otp',
        CommonValidationMiddleware.isValidEmailPayload,
        UserValidation.isUnverifiedUserExistsPayload,
        AuthController.sendUserVerificationOtp
    );

    router.post(
        '/otp/verify',
        OtpValidationMiddleware.isValidOtpPayload,
        UserValidation.isUnverifiedUserExistsPayload,
        AuthController.verifyUserVerificationOtp
    );

    router.get(
        '/google',
        passport.authenticate('google',
        { scope: ['profile', 'email'] })
    );

    router.get(
        '/google/callback',
        passport.authenticate('google', 
        { failureRedirect: '/' }),
        (req, res) => {
            if (req.user.redirect) {
                res.redirect(req.user.redirect);
            } else {
                res.redirect('/');
            }
        }
    );
};