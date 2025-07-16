import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import passport from '../loaders/passport.js';
import { AuthValidationMiddleware } from '../middlewares/validation/auth.js';
import { UserValidation } from '../middlewares/validation/user.js';
import { CommonValidationMiddleware } from '../middlewares/validation/common.js';
import { OtpValidationMiddleware } from '../middlewares/validation/otp.js';
import { AuthMiddleware } from '../middlewares/auth.js';
import { appEnv } from '../utils/env.js';
import { upload } from '../middlewares/upload.js';

export default (app) => {
    const router = Router();

    app.use('/auth', router);

    router.post(
        '/register',
        AuthValidationMiddleware.isValidRegisterPayload,
        AuthController.register
    );

    router.post(
        '/login', 
        AuthValidationMiddleware.isValidLoginPayload, 
        AuthController.login
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
    
    router.post(
        '/password-change',
        AuthValidationMiddleware.isValidChangePasswordPayload,
        AuthMiddleware.isAuthorized,
        AuthController.changePassword
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
    
    router.post(
        '/add-user',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole('admin'),
        upload.single('photo'),
        AuthValidationMiddleware.isValidAddUserPayload,
        AuthController.createUserWithRole
    );
    
    router.post(
        '/add-student',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole('admin'),
        AuthValidationMiddleware.isValidAddStudentPayload,
        AuthController.addStudentByAdmin
    );

    router.get(
        '/google',
        passport.authenticate('google',
        { scope: ['profile', 'email'] })
    );

    router.get(
        '/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {

          const { token, isNew } = req.user || {};
          if (token) {
            if (isNew) {
              res.redirect(`/google/success?token=${token}&new=1`);
            } else {
              res.redirect(`/google/success?token=${token}`);
            }
          } else {
            res.redirect('/login?error=google');
          }
        }
    );
};