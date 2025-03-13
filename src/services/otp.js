import { prisma } from '../utils/db.js';
// import { sendOtpEmail } from '../utils/emails/core/otp.js';
import { HttpError } from '../utils/error.js';
import { generateRandomOTP } from '../utils/helper.js';

// /** @import {ValidOtpPayload} from '../middlewares/validation/otp.js' */

/** @param {string} name */
/** @param {string} email */
/** @param {string} userId */
async function sendUserVerificationOtp(name, email, userId) {
  await prisma.$transaction(async (tx) => {
    await tx.otp.deleteMany({ where: { userId } });

    const otpCode = generateRandomOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expire in 5 mins

    await tx.otp.create({ data: { userId, code: otpCode, expiresAt } });
    // await sendOtpEmail({ name, email, otpCode });
  });
}

/** @param {ValidOtpPayload} payload */
async function verifyOtp({ email, code }) {
  const otp = await prisma.otp.findFirst({
    where: { user: { email }, code, expiresAt: { gte: new Date() } }
  });

  if (!otp) throw new HttpError(400, { message: 'Invalid or expired OTP' });

  await prisma.$transaction(async (tx) => {
    await tx.otp.deleteMany({ where: { userId: otp.userId } });
    await tx.user.update({ where: { id: otp.userId }, data: { verified: true } });
  });

  return { message: 'OTP verified successfully' };
}

export const OtpService = { sendUserVerificationOtp, verifyOtp };
