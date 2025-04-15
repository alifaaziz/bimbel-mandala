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