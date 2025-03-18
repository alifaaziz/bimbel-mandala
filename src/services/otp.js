import { prisma } from '../utils/db.js';
import { sendOtpEmail } from '../utils/emails/core/otp.js';
import { generateRandomOTP } from '../utils/helper.js';

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
 * Verifies the OTP sent to the user's email.
 *
 * @async
 * @function verifyOtp
 * @param {Object} data - The data object.
 * @param {string} data.email - The user's email.
 * @param {string} data.otp - The OTP code.
 * @returns {Promise<Object>} The success message.
 * @throws {HttpError} Throws an error if the OTP is invalid or expired.
 */
async function verifyOtp({ email, otp }) {
  const otpRecord = await prisma.otp.findFirst({
    where: { user: { email }, otp, expiredAt: { gte: new Date() }, used: false }
  });

  if (!otpRecord) throw new HttpError(400, { message: 'Invalid or expired OTP' });

  await prisma.$transaction(async (tx) => {
    await tx.otp.updateMany({ where: { userId: otpRecord.userId }, data: { used: true } });
    await tx.user.update({ where: { id: otpRecord.userId }, data: { verified: true } });
  });

  return { message: 'OTP verified successfully' };
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