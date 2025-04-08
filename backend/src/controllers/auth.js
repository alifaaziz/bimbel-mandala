import { UserService } from '../services/user.js';
import { AuthService } from '../services/auth.js';
import { OtpService } from '../services/otp.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

/**
 * Logs in a user.
 * 
 * @function login
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if login fails.
 */
async function login(req, res) {
    const userWithToken = await AuthService.login(req.body);
    res.status(200).json({ data: userWithToken });
}

/**
 * Registers a new user.
 * 
 * @function register
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if registration fails.
 */
async function register(req, res) {
    console.log('Received request body:', req.body); 
    await UserService.createStudent(req.body);
    res.status(200).json({
        data: { message: 'Register success, waiting for OTP verification' }
    });
}

/**
 * Creates a new admin user.
 * 
 * @function createUserWithRole
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if admin user creation fails.
 */
async function createUserWithRole(req, res) {
    const adminUser = await UserService.createUserWithRole(req.body);
    res.status(201).json({ data: adminUser });
}

/**
 * Sends a password reset email to the user.
 * 
 * @function sendPasswordResetEmail
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if sending email fails.
 */
async function sendPasswordResetEmail(req, res) {
    await AuthService.sendPasswordResetEmail(req.body.email);
    res.status(200).json({ message: 'Password reset has been sent in your email' });
}

/**
 * Resets the user's password.
 * 
 * @function resetPassword
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if password reset fails.
 */
async function resetPassword(req, res) {
    await AuthService.resetPassword(req.body);
    res.status(200).json({ message: 'Password reset successful' });
}

/**
 * Verifies the password reset token.
 * 
 * @function verifyPasswordResetToken
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if token verification fails.
 */
async function verifyPasswordResetToken(req, res) {
    await AuthService.verifyPasswordResetToken(req.params.token);
    res.status(200).json({ message: 'Password reset token is valid' });
}

/**
 * Sends a user verification OTP.
 * 
 * @function sendUserVerificationOtp
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if sending OTP fails.
 */
async function sendUserVerificationOtp(_req, res) {
    const { id: userId, name, email } = res.locals.user;
    await OtpService.sendUserVerificationOtp(name, email, userId);
    res.status(201).json({ message: 'OTP sent successfully' });
}

/**
 * Verifies the user verification OTP.
 * 
 * @function verifyUserVerificationOtp
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if OTP verification fails.
 */
async function verifyUserVerificationOtp(req, res) {
    const { email, otp } = req.body;
    await OtpService.verifyOtp({ email, otp });
    res.status(200).json({ message: 'OTP verified successfully' });
}

export const AuthController = {
    login: asyncWrapper(login),
    register: asyncWrapper(register),
    createUserWithRole: asyncWrapper(createUserWithRole),
    sendPasswordResetEmail: asyncWrapper(sendPasswordResetEmail),
    resetPassword: asyncWrapper(resetPassword),
    verifyPasswordResetToken: asyncWrapper(verifyPasswordResetToken),
    sendUserVerificationOtp: asyncWrapper(sendUserVerificationOtp),
    verifyUserVerificationOtp: asyncWrapper(verifyUserVerificationOtp)
};