import { prisma } from '../utils/db.js';
import bcrypt from 'bcrypt';
import { sendTutorVerificationEmail } from '../utils/emails/core/tutor.js';
import { HttpError } from '../utils/error.js';
import { savePhoto } from '../utils/helper.js';

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

  if (file) {
    const photoPath = await savePhoto(file, data.name || 'tutor');
    data.photo = photoPath;
  }

  if (data.days && Array.isArray(data.days)) {
    data.days = JSON.stringify(data.days);
  }

  const application = await prisma.tutorApplication.create({
    data: {
      ...data,
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

    const tutor = await tx.tutor.create({
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

    if (application.days) {
      let daysArr;
      try {
        daysArr = JSON.parse(application.days);
      } catch {
        daysArr = [];
      }
      if (Array.isArray(daysArr)) {
        for (const dayName of daysArr) {
          const day = await tx.day.findFirst({ where: { daysName: dayName } });
          if (day) {
            await tx.tutorDay.create({
              data: {
                tutorId: tutor.id,
                daysId: day.id,
              },
            });
          }
        }
      }
    }

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

    await sendTutorVerificationEmail(user.email, defaultPassword);

    return user;
  });
}

/**
 * Get tutor applications with pagination.
 *
 * @async
 * @function getTutorApplications
 * @param {Object} [options] - Pagination options.
 * @param {number} [options.page=1] - Page number (1-based).
 * @param {number} [options.pageSize=10] - Number of items per page.
 * @returns {Promise<Object>} The paginated list of tutor applications and total count.
 */
async function getTutorApplications({ page = 1, pageSize = 10 } = {}) {
  const skip = (page - 1) * pageSize;
  const [applications, total] = await Promise.all([
    prisma.tutorApplication.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'asc' },
    }),
    prisma.tutorApplication.count(),
  ]);
  return {
    data: applications.map(app => ({ id: app.id, name: app.name })),
    total,
    page,
    pageSize,
  };
}

/**
 * Get a single tutor application by ID.
 *
 * @async
 * @function getTutorApplicationById
 * @param {string} id - The tutor application ID.
 * @returns {Promise<Object|null>} The tutor application or null if not found.
 */
async function getTutorApplicationById(id) {
  return await prisma.tutorApplication.findUnique({
    where: { id },
  });
}

/**
 * Rejects (deletes) a tutor application by ID.
 *
 * @async
 * @function rejectTutorApplication
 * @param {string} applicationId - The ID of the tutor application to reject.
 * @returns {Promise<void>}
 * @throws {HttpError} If the tutor application is not found.
 */
async function rejectTutorApplication(applicationId) {
  const application = await prisma.tutorApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new HttpError(404, { message: 'Tutor application not found' });
  }

  await prisma.tutorApplication.delete({
    where: { id: applicationId },
  });
}

export const TutorApplicationService = {
  applyTutor,
  verifyTutor,
  getTutorApplications,
  getTutorApplicationById,
  rejectTutorApplication,
};