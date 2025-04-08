import { prisma } from '../utils/db.js';

/**
 * Creates schedules for a class.
 *
 * @async
 * @function createSchedules
 * @param {String} classId - The ID of the class.
 * @returns {Promise<Array>} The created schedules.
 */
async function createSchedules(classId) {
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        order: {
          include: {
            bimbelPackage: {
              include: {
                packageDay: {
                  include: {
                    day: true
                  }
                }
              }
            }
          }
        }
      }
    });
  
    if (!classData) {
      throw new Error('Class not found');
    }
  
    const { bimbelPackage } = classData.order;
    const { packageDay, totalMeetings, time } = bimbelPackage;
  
    if (!time || isNaN(new Date(time).getTime())) {
      throw new Error('Invalid time format in bimbelPackage');
    }

    const days = packageDay.map((pd) => pd.day.daysName);

    const startDate = new Date();
    const schedules = [];
    let meet = 1;

    const totalWeeks = totalMeetings * 4; // Asumsi 4 minggu dalam sebulan
    let currentDate = new Date(startDate);
  
    for (let week = 0; week < totalWeeks; week++) {
      for (const dayName of days) {
        const dayIndex = getDayIndex(dayName);
        const scheduleDate = getNextDate(currentDate, dayIndex);

        if (scheduleDate > currentDate) {
          const scheduleWithTime = new Date(scheduleDate);
          const timeDate = new Date(time);
          scheduleWithTime.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);
  
          schedules.push({
            classId,
            date: scheduleWithTime,
            meet: meet++,
            status: 'terjadwal'
          });

          currentDate = new Date(scheduleWithTime);
        }
      }
    }

    await prisma.schedule.createMany({
      data: schedules
    });

    const createdSchedules = await prisma.schedule.findMany({
      where: { classId },
      orderBy: { date: 'asc' }
    });
  
    return createdSchedules;
  }

/**
 * Converts a day name in Indonesian to its corresponding index (e.g., Senin -> 1).
 *
 * @param {String} dayName - The name of the day in Indonesian.
 * @returns {Number} The index of the day.
 */
function getDayIndex(dayName) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days.indexOf(dayName);
}

/**
 * Gets the next date for a specific day of the week.
 *
 * @param {Date} currentDate - The current date.
 * @param {Number} dayIndex - The index of the day (e.g., Senin -> 1).
 * @returns {Date} The next date for the specified day.
 */
function getNextDate(currentDate, dayIndex) {
  const date = new Date(currentDate);
  
  while (date.getDay() !== dayIndex) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

export const ScheduleService = {
  createSchedules
};