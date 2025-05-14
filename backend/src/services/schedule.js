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

  const { order } = classData;
  const { bimbelPackage } = order;
  const { packageDay, totalMeetings, time } = bimbelPackage;

  if (!totalMeetings || totalMeetings <= 0) {
    throw new Error('Invalid totalMeetings in bimbelPackage');
  }

  if (!time || isNaN(new Date(time).getTime())) {
    throw new Error('Invalid time format in bimbelPackage');
  }

  const days = packageDay.map((pd) => pd.day.daysName);

  const startDate = new Date();
  const schedules = [];
  let meet = 1;
  let currentDate = new Date(startDate);

  while (meet <= totalMeetings) {
    for (const dayName of days) {
      if (meet > totalMeetings) break;

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
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object containing user information.
 * @param {Boolean} isAdmin - Whether the action is performed by an admin.
 * @returns {Promise<Object>} The updated schedule.
 * @throws {Error} If the schedule is not found or the new date is invalid.
 */
async function reschedule(scheduleId, newDate, req, res, isAdmin = false) {
  if (!newDate || isNaN(new Date(newDate).getTime())) {
    throw new Error('Invalid new date format');
  }

  if (new Date(newDate) < new Date()) {
    throw new Error('New date cannot be in the past');
  }

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      attendances: true,
      class: {
        include: {
          order: {
            include: {
              bimbelPackage: true,
              user: true
            }
          }
        }
      }
    }
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  if (schedule.status === 'jadwal_ulang') {
    throw new Error('Reschedule can only be done once');
  }

  const attendance = schedule.attendances[0];
  if (attendance && (attendance.status === 'masuk' || attendance.status === 'izin')) {
    throw new Error('Cannot reschedule after attendance has been recorded');
  }

  const updatedSchedule = await prisma.schedule.update({
    where: { id: scheduleId },
    data: { date: new Date(newDate), status: 'jadwal_ulang' }
  });

  const { class: classData } = schedule;
  const { order } = classData;
  const { bimbelPackage, user: student } = order;

  const tutor = await prisma.tutor.findUnique({
    where: { userId: bimbelPackage.userId },
    include: { user: true }
  });

  const loggedInUser = res.locals.user;

  const actorForStudent = isAdmin
    ? 'Admin'
    : `${tutor.gender === 'Male' ? 'Pak' : 'Bu'} ${tutor.user.name}`;

  const actorForTutor = isAdmin
    ? 'Admin'
    : loggedInUser.id === tutor.userId
    ? 'Anda'
    : `${tutor.gender === 'Male' ? 'Pak' : 'Bu'} ${tutor.user.name}`;

  const studentDescription = `<strong>${actorForStudent}</strong> melakukan perubahan jadwal pada <strong>${bimbelPackage.name} ${bimbelPackage.level} #${classData.code}</strong>.`;
  await prisma.notification.create({
    data: {
      userId: student.id,
      type: 'Perubahan Jadwal',
      description: studentDescription
    }
  });

  const tutorDescription = `<strong>${actorForTutor}</strong> melakukan perubahan jadwal pada <strong>${bimbelPackage.name} ${bimbelPackage.level} #${classData.code}</strong>.`;
  await prisma.notification.create({
    data: {
      userId: tutor.userId,
      type: 'Perubahan Jadwal',
      description: tutorDescription
    }
  });

  return updatedSchedule;
}

/**
 * Get closest schedule from today
 * 
 * @async
 * @function getClosestSchedules
 * @returns {Promise<Array>} The closest schedules, each with class code and tutor name included.
 * @throws {Error} If there are no schedules.
 */
async function getClosestSchedules() {
  const schedules = await prisma.schedule.findMany({
    where: {
      date: {
        gte: new Date()
      }
    },
    include: {
      class: {
        select: {
          code: true,
          tutorId: true
        }
      }
    },
    orderBy: {
      date: 'asc'
    }
  });

  if (!schedules || schedules.length === 0) {
    throw new Error('No schedules found');
  }

  const tutorIds = [
    ...new Set(
      schedules
        .map(s => s.class?.tutorId)
        .filter(Boolean)
    )
  ];

  const tutors = await prisma.user.findMany({
    where: { id: { in: tutorIds } },
    select: {
      id: true,
      name: true,
      tutors: {
        select: {
          gender: true
        }
      }
    }
  });

  const tutorMap = {};
  tutors.forEach(t => {
    const gender = Array.isArray(t.tutors) && t.tutors.length > 0 ? t.tutors[0].gender : undefined;
    tutorMap[t.id] = {
      name: t.name,
      gender: gender
    };
  });

  return schedules.map(schedule => {
    const tutorId = schedule.class?.tutorId;
    const tutor = tutorMap[tutorId] || {};
    let tutorName = tutor.name || null;
    if (tutor.gender === 'Male' && tutorName) {
      tutorName = `Pak ${tutorName}`;
    }
    return {
      id: schedule.id,
      classId: schedule.classId,
      date: schedule.date,
      meet: schedule.meet,
      status: schedule.status,
      information: schedule.information,
      classCode: schedule.class?.code || null,
      tutorName
    };
  });
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
    include: {
      class: true,
      attendances: { 
        where: { userId },
        select: {
          status: true
        }
      }
    },
    orderBy: { date: 'asc' }
  });

  if (!schedules || schedules.length === 0) {
    throw new Error('No schedules found for this student');
  }

  return schedules.map(schedule => {
    const attendance = schedule.attendances[0]; 
    return {
      id: schedule.id,
      classId: schedule.classId,
      date: schedule.date,
      meet: schedule.meet,
      status: attendance ? attendance.status : schedule.status,
      information: schedule.information,
      class: {
        id: schedule.class.id,
        code: schedule.class.code,
        orderId: schedule.class.orderId,
        tutorId: schedule.class.tutorId
      }
    };
  });
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
        tutorId: userId 
      }
    },
    include: {
      class: true,
      attendances: { 
        where: { userId }, 
        select: {
          status: true
        }
      }
    },
    orderBy: {
      date: 'asc'
    }
  });

  if (!schedules || schedules.length === 0) {
    throw new Error('No schedules found for this tutor');
  }

  return schedules.map(schedule => {
    const attendance = schedule.attendances[0]; 
    return {
      id: schedule.id,
      classId: schedule.classId,
      date: schedule.date,
      meet: schedule.meet,
      status: attendance ? attendance.status : schedule.status, 
      information: schedule.information,
      class: {
        id: schedule.class.id,
        code: schedule.class.code,
        orderId: schedule.class.orderId,
        tutorId: schedule.class.tutorId // Ambil tutorId langsung dari tabel Class
      }
    };
  });
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