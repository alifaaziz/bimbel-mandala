import { prisma } from '../utils/db.js';
import bcrypt from 'bcrypt';
import { sendTutorVerificationEmail } from '../utils/emails/core/tutor.js';
import { HttpError } from '../utils/error.js';

/**
 * Apply for tutor.
 *
 * @async
 * @function applyTutor
 * @param {Object} data - The tutor application data.
 * @returns {Promise<Object>} The created tutor application record.
 * @throws {HttpError} If the email is already registered in tutorApplication or user.
 */
async function applyTutor(data) {
  const existingApplication = await prisma.tutorApplication.findUnique({
    where: { email: data.email },
  });

  if (existingApplication) {
    throw new HttpError(400, { message: 'Email sudah digunakan untuk pendaftaran tutor.' });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new HttpError(400, { message: 'Email sudah terdaftar sebagai pengguna.' });
  }

  // Create tutor application
  const application = await prisma.tutorApplication.create({
    data,
  });

  return application;
}

/**
 * Verifies a tutor application and creates a user and tutor record.
 *
 * @async
 * @function verifyTutor
 * @param {string} applicationId - The ID of the tutor application to verify.
 * @returns {Promise<Object>} The created user record.
 * @throws {HttpError} If the tutor application is not found.
 */
async function verifyTutor(applicationId) {
  return await prisma.$transaction(async (tx) => {
    const application = await tx.tutorApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new HttpError(404, { message: 'Tutor application not found' });
    }

    // Encrypt the default password
    const defaultPassword = 'bimbelmandala';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create a new user
    const user = await tx.user.create({
      data: {
        name: application.name,
        email: application.email,
        password: hashedPassword,
        role: 'tutor',
        verified: true,
      },
    });

    // Create a new tutor
    await tx.tutor.create({
      data: {
        userId: user.id,
        birthDate: application.birthDate,
        gender: application.gender,
        phone: application.phone,
        subjects: application.subjects,
        status: application.status,
        major: application.major,
        school: application.school,
        teachLevel: application.teachLevel,
        description: application.description,
        photo: application.photo,
      },
    });

    // Delete the application record
    await tx.tutorApplication.delete({
      where: { id: applicationId },
    });

    // Create a notification
    await tx.notification.create({
      data: {
        userId: user.id,
        type: 'Pendaftaran Akun',
        description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
      },
    });

    // Send verification email
    await sendTutorVerificationEmail(user.email, user.name, defaultPassword);

    return user;
  });
}

export const TutorApplicationService = {
  applyTutor,
  verifyTutor,
};