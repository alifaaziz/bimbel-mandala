import { prisma } from '../utils/db.js';
import { sendOtpEmail } from '../utils/emails/core/otp.js';
import { generateRandomOTP } from '../utils/helper.js';
import { HttpError } from '../utils/error.js';
import { AuthService } from './auth.js'; 

/**
 * Sends an OTP to the user's email for verification.
 * 
 * @async
 * @function sendUserVerificationOtp
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} userId - The user's ID.
 * @returns {Promise<void>} A promise that resolves when the OTP is sent.
 */
async function sendUserVerificationOtp(name, email, userId) {
  await prisma.$transaction(async (tx) => {
    await invalidateAllUserOtps(tx, userId);

    const nextFiveMinutesDate = new Date();
    nextFiveMinutesDate.setMinutes(nextFiveMinutesDate.getMinutes() + 5);

    const payload = {
      otp: generateRandomOTP(),
      used: false,
      userId: userId,
      expiredAt: nextFiveMinutesDate
    };

    const { otp } = await tx.otp.create({
      data: payload
    });

    await sendOtpEmail(email, otp, nextFiveMinutesDate);
  });
}

/**
 * Verifies the OTP sent to the user's email and logs in the user if valid.
 *
 * @async
 * @function verifyOtp
 * @param {Object} data - The data object.
 * @param {string} data.email - The user's email.
 * @param {string} data.otp - The OTP code.
 * @returns {Promise<Object>} The user object with a token.
 * @throws {HttpError} Throws an error if the OTP is invalid or expired.
 */
async function verifyOtp({ email, otp }) {
  const otpRecord = await prisma.otp.findFirst({
    where: { user: { email }, otp, expiredAt: { gte: new Date() }, used: false }
  });

  if (!otpRecord) throw new HttpError(400, { message: 'Invalid or expired OTP' });

  const userId = otpRecord.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      googleId: true,
    }
  });

  if (!user) {
    throw new HttpError(404, { message: 'User not found' });
  }

  await prisma.$transaction(async (tx) => {
    await tx.otp.updateMany({ where: { userId }, data: { used: true } });
    await tx.user.update({ where: { id: userId }, data: { verified: true } });
  });
  
  const token = await AuthService.generateToken(user.id);

  return {
    ...user,
    token
  };
}

/**
 * @param {PrismaTransaction} tx
 * @param {string} userId
 */
function invalidateAllUserOtps(tx, userId) {
  return tx.otp.updateMany({
    where: {
      userId,
      expiredAt: {
        gte: new Date()
      }
    },
    data: {
      used: true
    }
  });
}

export const OtpService = { sendUserVerificationOtp, verifyOtp, invalidateAllUserOtps };