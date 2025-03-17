import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import passport from '../loaders/passport.js';

/** @param {Router} app */
export default (app) => {
    const router = Router();

    app.use('/auth', router);

    router.post('/register', AuthController.register);

    router.post('/login', AuthController.login);

    router.post('/admin', AuthController.createAdminUser);

    router.post('/password-reset', AuthController.sendPasswordResetEmail);

    router.get('/password-reset/:token', AuthController.verifyPasswordResetToken);

    router.post('/password-reset/confirm', AuthController.resetPassword);

    router.get('/otp', (_req, res) => {
        res.status(200).json({ message: 'disini tempat otp nanti' });
      });

    router.post('/otp/verify', AuthController.verifyUserVerificationOtp);

    // Rute untuk memulai otentikasi Google
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // Rute untuk menangani callback dari Google
    router.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {
            if (req.user.redirect) {
                // Redirect to OTP verification page
                res.redirect(req.user.redirect);
            } else {
                // Otentikasi berhasil, redirect ke halaman profil pengguna
                res.redirect('/');
            }
        }
    );
};