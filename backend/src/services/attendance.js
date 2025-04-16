import { prisma } from '../utils/db.js';

/**
 * Creates an attendance record.
 *
 * @async
 * @function createAttendance
 * @param {Object} data - The attendance data.
 * @param {string} data.scheduleId - The schedule ID.
 * @param {string} data.userId - The user ID.
 * @param {string} data.status - The attendance status (masuk/izin).
 * @param {string} [data.reason] - The reason for absence (only for izin).
 * @returns {Promise<Object>} The created attendance record.
 */
export async function createAttendance({ scheduleId, userId, status, reason = null }) {
  const attendance = await prisma.attendance.create({
    data: {
      scheduleId,
      userId,
      status,
      reason
    }
  });

  return attendance;
}

/**
 * Automatically marks attendance as 'alpha' for all users and tutors
 * involved in a schedule if the schedule date has passed and no attendance exists.
 *
 * @async
 * @function markAlphaForMissedSchedules
 * @returns {Promise<void>}
 */
export async function markAlphaForMissedSchedules() {
  const now = new Date();

  const schedules = await prisma.schedule.findMany({
    where: {
      date: {
        lt: now
      },
      attendances: {
        none: {}
      }
    },
    include: {
      class: {
        include: {
          studentClasses: {
            include: {
              user: true
            }
          },
          tutor: true
        }
      }
    }
  });

  for (const schedule of schedules) {
    const { id: scheduleId, class: { studentClasses, tutorId } } = schedule;

    for (const studentClass of studentClasses) {
      await prisma.attendance.create({
        data: {
          scheduleId,
          userId: studentClass.user.id,
          status: 'alpha',
          reason: null
        }
      });
    }

    if (tutorId) {
      await prisma.attendance.create({
        data: {
          scheduleId,
          userId: tutorId,
          status: 'alpha',
          reason: null
        }
      });
    }
  }
}