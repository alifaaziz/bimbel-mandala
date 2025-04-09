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

/**
 * Reschedules a specific schedule.
 *
 * @async
 * @function reschedule
 * @param {String} scheduleId - The ID of the schedule to be rescheduled.
 * @param {Date} newDate - The new date for the schedule.
 * @returns {Promise<Object>} The updated schedule.
 * @throws {Error} If the schedule is not found or the new date is invalid.
 */
async function reschedule(scheduleId, newDate) {
  if (!newDate || isNaN(new Date(newDate).getTime())) {
    throw new Error('Invalid new date format');
  }

  if (new Date(newDate) < new Date()) {
    throw new Error('New date cannot be in the past');
  }

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId }
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  const updatedSchedule = await prisma.schedule.update({
    where: { id: scheduleId },
    data: { date: new Date(newDate) }
  });

  return updatedSchedule;
}

/**
 * Get closest schedule from today
 * 
 * @async
 * @function getClosestSchedule
 * @param {String} classId - The ID of the class.
 * @returns {Promise<Object>} The closest schedule.
 * @throws {Error} If the class is not found or there are no schedules.
 */
async function getClosestSchedules() {
  const schedules = await prisma.schedule.findMany({
    where: {
      date: {
        gte: new Date()
      }
    },
    orderBy: {
      date: 'asc'
    }
  });

  if (!schedules || schedules.length === 0) {
    throw new Error('No schedules found');
  }

  return schedules;
}

/**
 * Get schedules for a student based on their user ID.
 *
 * @async
 * @function getSchedulesForStudent
 * @param {String} userId - The ID of the logged-in student.
 * @returns {Promise<Array>} The schedules for the student.
 */
async function getSchedulesForStudent(userId) {

  const studentClasses = await prisma.studentClass.findMany({
    where: { userId: userId },
    select: { classId: true }
  });

  const classIds = studentClasses.map((sc) => sc.classId);

  if (classIds.length === 0) {
    throw new Error('No classes found for this student');
  }

  const schedules = await prisma.schedule.findMany({
    where: { classId: { in: classIds } },
    include: { class: true },
    orderBy: { date: 'asc' }
  });

  if (!schedules || schedules.length === 0) {
    throw new Error('No schedules found for this student');
  }

  return schedules;
}


/**
 * Get schedules for a tutor based on their user ID.
 *
 * @async
 * @function getSchedulesForTutor
 * @param {String} userId - The ID of the logged-in tutor.
 * @returns {Promise<Array>} The schedules for the tutor.
 */
async function getSchedulesForTutor(userId) {
  const schedules = await prisma.schedule.findMany({
    where: {
      class: {
        order: {
          bimbelPackage: {
            userId 
          }
        }
      }
    },
    include: {
      class: true
    },
    orderBy: {
      date: 'asc'
    }
  });

  if (!schedules || schedules.length === 0) {
    throw new Error('No schedules found for this tutor');
  }

  return schedules;
}

/**
 * Get schedules for the logged-in user based on their role.
 *
 * @async
 * @function getSchedulesByRole
 * @param {String} userId - The ID of the logged-in user.
 * @returns {Promise<Array>} The schedules for the user.
 */
async function getSchedulesByRole(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { role } = user;

  if (role === 'siswa') {
    return await getSchedulesForStudent(userId);
  } else if (role === 'tutor') {
    return await getSchedulesForTutor(userId);
  }
}

export const ScheduleService = {
  createSchedules,
  reschedule,
  getClosestSchedules,
  getSchedulesForStudent,
  getSchedulesForTutor,
  getSchedulesByRole
};