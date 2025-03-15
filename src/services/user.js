import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';
import { AuthService } from './auth.js';
import { OtpService } from './otp.js';

/** @param {ValidCreateUserPayload} payload */
async function createUser(payload) {
    const { name, email, password, role } = payload;
    const encryptedPassword = await AuthService.hashPassword(password);

    /** @type {Prisma.UserCreateInput} */
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
          email ,
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

export const UserService = { createUser };