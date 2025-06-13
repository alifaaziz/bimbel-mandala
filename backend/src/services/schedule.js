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
  const { packageDay, totalMeetings, time, name, level } = bimbelPackage;

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

        const slugBase = `${name.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase().replace(/\s+/g, '-')}-${classData.code}`;
        let slug;
        do {
          const randomString = Math.random().toString(36).substring(2, 8);
          slug = `${slugBase}-${randomString}`;
        } while (await prisma.schedule.findUnique({ where: { slug } }));

        schedules.push({
          classId,
          date: scheduleWithTime,
          meet: meet++,
          status: 'terjadwal',
          slug
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
 * Helper to get tutor name with prefix Pak/Bu.
 * @param {Object} tutor - Tutor object (with gender and user).
 * @returns {string|null} Tutor name with prefix or null.
 */
function getTutorName(tutor) {
  if (!tutor || !tutor.user) return null;
  const prefix = tutor.gender === 'Male' ? 'Pak' : 'Bu';
  return `${prefix} ${tutor.user.name}`;
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

  const attendance = schedule.attendances?.[0] || null;
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
  const tutorPhoto = tutor?.photo || null;

  const loggedInUser = res.locals.user;

  const actorForStudent = isAdmin
    ? 'Admin'
    : getTutorName(tutor);

  const actorForTutor = isAdmin
    ? 'Admin'
    : loggedInUser.id === tutor.userId
    ? 'Anda'
    : getTutorName(tutor);

  const studentDescription = `<strong>${actorForStudent}</strong> melakukan perubahan jadwal pada <strong>${bimbelPackage.name} ${bimbelPackage.level} #${classData.code}</strong>.`;
  await prisma.notification.create({
    data: {
      userId: student.id,
      type: 'Perubahan Jadwal',
      description: studentDescription,
      photo: tutorPhoto
    }
  });

  const tutorDescription = `<strong>${actorForTutor}</strong> melakukan perubahan jadwal pada <strong>${bimbelPackage.name} ${bimbelPackage.level} #${classData.code}</strong>.`;
  await prisma.notification.create({
    data: {
      userId: tutor.userId,
      type: 'Perubahan Jadwal',
      description: tutorDescription,
      photo: tutorPhoto
    }
  });

  return updatedSchedule;
}

/**
 * Update schedule information.
 *
 * @async
 * @function updateScheduleInformation
 * @param {String} scheduleId - The ID of the schedule to update.
 * @param {String} information - The new information for the schedule.
 * @returns {Promise<Object>} The updated schedule.
 * @throws {Error} If the schedule is not found or the update fails.
 */
async function updateScheduleInformation(scheduleId, information) {
  if (!information || typeof information !== 'string') {
    throw new Error('Invalid information provided');
  }

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  const updatedSchedule = await prisma.schedule.update({
    where: { id: scheduleId },
    data: { information },
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
    where: { date: { gte: new Date() } },
    include: {
      class: {
        include: {
          order: {
            include: {
              bimbelPackage: {
                include: {
                  user: true,
                  groupType: true
                }
              },
              groupType: true
            }
          },
          tutor: {
            include: { tutors: true }
          }
        }
      }
    },
    orderBy: { date: 'asc' }
  });

  if (!schedules || schedules.length === 0) {
    throw new Error('No schedules found');
  }

  return schedules.map(schedule => {
    const classData = schedule.class;
    const order = classData?.order;
    const bimbelPackage = order?.bimbelPackage;
    const groupType = order?.groupType;
    const tutor = classData?.tutor;
    const tutorGender = tutor?.tutors?.[0]?.gender;
    const tutorName = tutor ? getTutorName({ gender: tutorGender, user: { name: tutor.name } }) : null;

    return {
      id: schedule.id,
      classCode: classData.code,
      packageName: bimbelPackage?.name || null,
      tutorName: tutorName,
      groupType: groupType?.type || null,
      meet: schedule.meet,
      date: schedule.date,
      duration: bimbelPackage?.duration || null,
      status: schedule.status,
      slug: schedule.slug || null,
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
    where: {
      classId: { in: classIds }
    },
    include: {
      class: {
        include: {
          order: {
            include: {
              bimbelPackage: {
                include: {
                  user: true,
                  groupType: true
                }
              },
              groupType: true
            }
          },
          tutor: {
            include: { tutors: true }
          }
        }
      },
      attendances: { 
        where: { userId },
        select: { status: true }
      }
    },
    orderBy: { date: 'asc' }
  });

  if (!schedules || schedules.length === 0) {
    throw new Error('No schedules found for this student');
  }

  const filtered = schedules.filter(s => s.class?.status !== 'selesai');
  const now = new Date();

  filtered.sort((a, b) => {
    const isAFuture = new Date(a.date) >= now;
    const isBFuture = new Date(b.date) >= now;
    if (isAFuture === isBFuture) {
      return new Date(a.date) - new Date(b.date);
    }
    return isAFuture ? -1 : 1;
  });

  return filtered.map(schedule => {
    const classData = schedule.class;
    const order = classData?.order;
    const bimbelPackage = order?.bimbelPackage;
    const groupType = order?.groupType;
    const tutor = classData?.tutor;
    const tutorGender = tutor?.tutors?.[0]?.gender;
    const tutorName = tutor ? getTutorName({ gender: tutorGender, user: { name: tutor.name } }) : null;
    const attendance = schedule.attendances?.[0] || null;

    return {
      id: schedule.id,
      classCode: classData.code,
      packageName: bimbelPackage?.name || null,
      level: bimbelPackage?.level || null,
      tutorName: tutorName,
      groupType: groupType?.type || null,
      meet: schedule.meet,
      date: schedule.date,
      duration: bimbelPackage?.duration || null,
      address: order?.address || null,
      info: schedule.information || null,
      status: attendance ? attendance.status : schedule.status,
      photo: tutor?.tutors?.[0]?.photo || null,
      slug: schedule.slug || null,
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
      class: { tutorId: userId }
    },
    include: {
      class: {
        include: {
          order: {
            include: {
              bimbelPackage: {
                include: {
                  user: true,
                  groupType: true
                }
              },
              groupType: true
            }
          },
          tutor: {
            include: { tutors: true }
          }
        }
      },
      attendances: { 
        where: { userId }, 
        select: { status: true }
      }
    },
    orderBy: { date: 'asc' }
  });

  if (!schedules || schedules.length === 0) {
    throw new Error('No schedules found for this tutor');
  }

  const filtered = schedules.filter(s => s.class?.status !== 'selesai');
  const now = new Date();

  filtered.sort((a, b) => {
    const isAFuture = new Date(a.date) >= now;
    const isBFuture = new Date(b.date) >= now;
    if (isAFuture === isBFuture) {
      return new Date(a.date) - new Date(b.date);
    }
    return isAFuture ? -1 : 1;
  });

  return filtered.map(schedule => {
    const classData = schedule.class;
    const order = classData?.order;
    const bimbelPackage = order?.bimbelPackage;
    const groupType = order?.groupType;
    const tutor = classData?.tutor;
    const tutorGender = tutor?.tutors?.[0]?.gender;
    const tutorName = tutor ? getTutorName({ gender: tutorGender, user: { name: tutor.name } }) : null;
    const attendance = schedule.attendances?.[0] || null;

    return {
      id: schedule.id,
      classCode: classData.code,
      packageName: bimbelPackage?.name || null,
      level: bimbelPackage?.level || null,
      tutorName: tutorName,
      groupType: groupType?.type || null,
      meet: schedule.meet,
      date: schedule.date,
      duration: bimbelPackage?.duration || null,
      address: order?.address || null,
      info: schedule.information || null,
      status: attendance ? attendance.status : schedule.status,
      photo: tutor?.tutors?.[0]?.photo || null,
      slug: schedule.slug || null,
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

/**
 * Get schedule detail by schedule slug.
 *
 * @async
 * @function getScheduleBySlug
 * @param {String} slug - The slug of the schedule.
 * @returns {Promise<Object>} The schedule detail.
 * @throws {Error} If the schedule is not found.
 */
async function getScheduleBySlug(slug) {
  const schedule = await prisma.schedule.findUnique({
    where: { slug }, // Cari berdasarkan slug
    include: {
      class: {
        include: {
          order: {
            include: {
              bimbelPackage: {
                include: {
                  user: true,
                  groupType: true
                }
              },
              groupType: true
            }
          },
          tutor: {
            include: { tutors: true }
          }
        }
      },
      attendances: true
    }
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  const classData = schedule.class;
  const order = classData?.order;
  const bimbelPackage = order?.bimbelPackage;
  const groupType = order?.groupType;
  const tutor = classData?.tutor;
  const tutorGender = tutor?.tutors?.[0]?.gender;
  const tutorName = tutor ? getTutorName({ gender: tutorGender, user: { name: tutor.name } }) : null;

  return {
    id: schedule.id,
    classCode: classData.code,
    packageName: bimbelPackage?.name || null,
    level: bimbelPackage?.level || null,
    tutorName: tutorName,
    groupType: groupType?.type || null,
    meet: schedule.meet,
    date: schedule.date,
    duration: bimbelPackage?.duration || null,
    status: schedule.status,
    attendances: schedule.attendances,
    address: order?.address || null,
    photo: tutor?.tutors?.[0]?.photo || null,
    info: schedule.information || null,
    tutorPhone: tutor?.tutors?.[0]?.phone,
    tutorEmail: tutor?.email,
    slug: schedule.slug || null,
  };
}


export const ScheduleService = {
  createSchedules,
  reschedule,
  updateScheduleInformation,
  getClosestSchedules,
  getSchedulesForStudent,
  getSchedulesForTutor,
  getSchedulesByRole,
  getScheduleBySlug,
  getNextDate,
  getTutorName
};