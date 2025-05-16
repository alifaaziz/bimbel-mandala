import { prisma } from '../utils/db.js';
import * as bcrypt from 'bcrypt';
import { sendTutorVerificationEmail } from '../utils/emails/core/tutor.js';
import { HttpError } from '../utils/error.js';
import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * Helper untuk menyimpan file foto ke folder public.
 * @param {Object} file - File object dari middleware upload (misal: multer).
 * @param {string} applicantName - Nama applicant.
 * @returns {Promise<string>} - Path relatif file foto.
 */
async function saveApplicantPhoto(file, applicantName) {
  if (!file) return null;
  const timestamp = Date.now();
  const ext = path.extname(file.originalname);
  const safeName = applicantName.replace(/\s+/g, '-').toLowerCase();
  const filename = `${safeName}-${timestamp}${ext}`;
  const destDir = path.resolve('public');
  const destPath = path.join(destDir, filename);

  // Pastikan folder tujuan ada
  await fs.mkdir(destDir, { recursive: true });
  // Pindahkan file dari temp ke folder public
  await fs.rename(file.path, destPath);

  // Path yang disimpan di DB (relatif dari public)
  return `/public/${filename}`;
}

/**
 * Apply for tutor.
 *
 * @async
 * @function applyTutor
 * @param {Object} data - The tutor application data.
 * @param {Object} [file] - File foto dari middleware upload (opsional).
 * @returns {Promise<Object>} The created tutor application record.
 * @throws {HttpError} If the email is already registered in tutorApplication or user.
 */
async function applyTutor(data, file) {
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

  let photoPath = null;
  if (file) {
    photoPath = await saveApplicantPhoto(file, data.name);
  }

  const application = await prisma.tutorApplication.create({
    data: {
      ...data,
      photo: photoPath,
    },
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

    const defaultPassword = 'bimbelmandala';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await tx.user.create({
      data: {
        name: application.name,
        email: application.email,
        password: hashedPassword,
        role: 'tutor',
        verified: true,
      },
    });

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

    await tx.tutorApplication.delete({
      where: { id: applicationId },
    });

    await tx.notification.create({
      data: {
        userId: user.id,
        type: 'Pendaftaran Akun',
        description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
      },
    });

    await sendTutorVerificationEmail(user.email, user.name, defaultPassword);

    return user;
  });
}

export const TutorApplicationService = {
  applyTutor,
  verifyTutor,
  saveApplicantPhoto,
};