import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';
import { sendOtpEmail } from '../utils/emails/core/otp.js';
import { generateRandomOTP } from '../utils/helper.js';

/** @param {string} name */
/** @param {string} email */
/** @param {string} userId */
async function sendUserVerificationOtp(name, email, userId) {
  await prisma.$transaction(async (tx) => {
    await tx.otp.deleteMany({ where: { userId } });

    const otpCode = generateRandomOTP();
    const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

    await tx.otp.create({ data: { userId, otp: otpCode, expiredAt } });
    await sendOtpEmail(email, otpCode, name);
  });
}

/** @param {ValidOtpPayload} payload */
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

export const OtpService = { sendUserVerificationOtp, verifyOtp };