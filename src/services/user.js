import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';
import { AuthService } from './auth.js';
import { OtpService } from './otp.js';

/** @param {ValidCreateUserPayload} payload */
async function createUser(payload) {
    console.log('Received payload:', payload, null, 2); // Log the payload
    if (!payload || !payload.name || !payload.email || !payload.password || !payload.role) {
        throw new HttpError(400, { message: 'Invalid payload' });
    }

    const { name, email, password, role } = payload;
    const encryptedPassword = await AuthService.hashPassword(password);

    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }], verified: true }
    });

    if (existingUser) {
        throw new HttpError(409, { message: 'Email already exists' });
    }

    const user = await prisma.user.create({
        data: { name, email, password: encryptedPassword, verified: false, role }
    });

    if (role === 'siswa') {
        await prisma.student.create({
            data: { userId: user.id }
        });
    } else if (role === 'tutor') {
        await prisma.tutor.create({
            data: { userId: user.id }
        });
    }

    // await OtpService.sendUserVerificationOtp(user.name, user.email, user.id);
    return user;
}

export const UserService = { createUser };