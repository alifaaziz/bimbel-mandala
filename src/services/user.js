import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';
import { AuthService } from './auth.js';
import { OtpService } from './otp.js';

/**
 * Creates a new user.
 *
 * @async
 * @function createUser
 * @param {Object} payload - The user payload.
 * @param {string} payload.name - The user's name.
 * @param {string} payload.email - The user's email.
 * @param {string} payload.password - The user's password.
 * @param {string} payload.role - The user's role.
 * @param {string} payload.googleId - The user's Google ID.
 * @returns {Promise<Object>} The new user object.
 * @throws {HttpError} Throws an error if the user creation fails.
 */
async function createUser(payload) {
    const { name, email, password, role, googleId } = payload;
    const encryptedPassword = password ? await AuthService.hashPassword(password) : null;

    const parsedUserWithEncryptedPassword = {
        ...payload,
        password: encryptedPassword
    };

    const verifiedUser = await prisma.user.findFirst({
        where: {
          email,
          verified: true
        }
      });

    if (verifiedUser) {
        let errorMessage = 'Email already exists';
        throw new HttpError(409, { message: errorMessage });
    }

    let user = null;

    const unverifiedUser = await prisma.user.findFirst({
        where: {
          email,
          verified: false
        }
      });

    if (unverifiedUser) {
        let errorMessage = 'Email already exists but not verified';
        throw new HttpError(409, { message: errorMessage });
    } else {
        const newUser = await prisma.user.create({
            data: parsedUserWithEncryptedPassword
        });
        user = newUser;
    }

    if (role === 'siswa') {
        await prisma.student.create({
            data: { userId: user.id }
        });
    } else if (role === 'tutor') {
        await prisma.tutor.create({
            data: { userId: user.id }
        });
    }

    await OtpService.sendUserVerificationOtp(user.name, user.email, user.id);
    return user;
}

/**
 * Creates a new admin user.
 *
 * @async
 * @function createAdminUser
 * @param {Object} payload - The user payload.
 * @param {string} payload.name - The user's name.
 * @param {string} payload.email - The user's email.
 * @param {string} payload.password - The user's password.
 * @returns {Promise<Object>} The new admin user object.
 * @throws {HttpError} Throws an error if the user creation fails.
 */
async function createAdminUser(payload) {
    const { name, email, password } = payload;
    const encryptedPassword = await AuthService.hashPassword(password);

    const parsedUserWithEncryptedPassword = {
        ...payload,
        password: encryptedPassword
    };

    let user = await prisma.user.findFirst({
        where: {
            email
        }
    });

    if (user) {
        let errorMessage = 'Email already exists';
        throw new HttpError(409, { message: errorMessage });
    }

    const adminUser = await prisma.user.create({
        data: {
            ...parsedUserWithEncryptedPassword,
            role: 'admin'
        }
    });
    user = adminUser;
    return user;
}

export const UserService = { createUser, createAdminUser };