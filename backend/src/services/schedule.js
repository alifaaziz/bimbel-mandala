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
          bimbelPackage: true 
        }
      }
    }
  });

  if (!classData) {
    throw new Error('Class not found');
  }

  const { order } = classData;
  const { bimbelPackage } = order;
  const { days, totalMeetings, time, name, level, startDate, duration } = bimbelPackage;

  if (!totalMeetings || totalMeetings <= 0) {
    throw new Error('Invalid totalMeetings in bimbelPackage');
  }

  if (!time || isNaN(new Date(time).getTime())) {
    throw new Error('Invalid time format in bimbelPackage');
  }

  let daysArr = [];
  if (Array.isArray(days)) {
    daysArr = days;
  } else if (typeof days === 'string') {
    try {
      daysArr = JSON.parse(days);
    } catch {
      daysArr = days.split(',').map(d => d.trim());
    }
  }

  const weekDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  daysArr = daysArr.sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));

  let startDateObj;
  if (
    classData.code &&
    classData.code.startsWith('CLS') &&
    startDate &&
    !isNaN(new Date(startDate).getTime())
  ) {
    startDateObj = new Date(startDate);
  } else {
    startDateObj = new Date();
    startDateObj.setDate(startDateObj.getDate() + 1);
    startDateObj.setHours(0, 0, 0, 0); 
  }

  const schedules = [];
  let meet = 1;
  let currentDate = new Date(startDateObj);

  while (meet <= totalMeetings) {
    for (const dayName of daysArr) {
      if (meet > totalMeetings) break;

      const dayIndex = getDayIndex(dayName);
      const scheduleDate = getNextDate(currentDate, dayIndex);

      if (scheduleDate > currentDate || (currentDate.getDay() === dayIndex && meet === 1)) {
        const scheduleWithTime = new Date(scheduleDate);
        const timeDate = new Date(time);
        scheduleWithTime.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);

        const endShow = new Date(scheduleWithTime);
        endShow.setMinutes(endShow.getMinutes() + duration);

        const slugBase = `${name.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase().replace(/\s+/g, '-')}-${classData.code}`;
        let slug;
        do {
          const randomString = Math.random().toString(36).substring(2, 8);
          slug = `${slugBase}-${randomString}`;
        } while (await prisma.schedule.findUnique({ where: { slug } }));

        schedules.push({
          classId,
          date: scheduleWithTime,
          endShow, 
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
 * Get closest schedules from today with pagination.
 * 
 * @async
 * @function getClosestSchedules
 * @param {Number} page - The page number (default: 1).
 * @param {Number} limit - The number of items per page (default: 10).
 * @returns {Promise<Object>} The paginated closest schedules, including total count and current page.
 * @throws {Error} If there are no schedules.
 */
async function getClosestSchedules(page = 1, limit = 10, search = '') {
  const offset = (page - 1) * limit;

  const now = new Date();
  now.setHours(now.getHours() + 7);

  const searchFilter = search
    ? {
        OR: [
          { class: { code: { contains: search } } },
          { class: { order: { bimbelPackage: { name: { contains: search } } } } },
          { class: { tutor: { name: { contains: search } } } }
        ]
      }
    : {};

  const [totalUpcoming, totalPast] = await Promise.all([
    prisma.schedule.count({
      where: {
        endShow: { gte: now },
        ...searchFilter
      }
    }),
    prisma.schedule.count({
      where: {
        endShow: { lt: now },
        ...searchFilter
      }
    })
  ]);

  const total = totalUpcoming + totalPast;
  const totalPages = Math.ceil(total / limit);

  let schedules = [];
  if (offset < totalUpcoming) {
    const takeUpcoming = Math.min(limit, totalUpcoming - offset);
    const upcomingSchedules = await prisma.schedule.findMany({
      where: {
        endShow: { gte: now },
        ...searchFilter
      },
      include: {
        class: {
          include: {
            order: {
              include: {
                bimbelPackage: { include: { user: true, groupType: true } },
                groupType: true
              }
            },
            tutor: { include: { tutors: true } }
          }
        }
      },
      orderBy: [{ date: 'asc' }, { id: 'asc' }],
      skip: offset,
      take: takeUpcoming
    });

    schedules = upcomingSchedules;

    if (takeUpcoming < limit) {
      const takePast = limit - takeUpcoming;
      const pastSchedules = await prisma.schedule.findMany({
        where: {
          endShow: { lt: now },
          ...searchFilter
        },
        include: {
          class: {
            include: {
              order: {
                include: {
                  bimbelPackage: { include: { user: true, groupType: true } },
                  groupType: true
                }
              },
              tutor: { include: { tutors: true } }
            }
          }
        },
        orderBy: [{ date: 'asc' }, { id: 'asc' }],
        skip: 0,
        take: takePast
      });
      schedules = [...schedules, ...pastSchedules];
    }
  } else {
    const pastOffset = offset - totalUpcoming;
    schedules = await prisma.schedule.findMany({
      where: {
        endShow: { lt: now },
        ...searchFilter
      },
      include: {
        class: {
          include: {
            order: {
              include: {
                bimbelPackage: { include: { user: true, groupType: true } },
                groupType: true
              }
            },
            tutor: { include: { tutors: true } }
          }
        }
      },
      orderBy: [{ date: 'asc' }, { id: 'asc' }],
      skip: pastOffset,
      take: limit
    });
  }

  const data = schedules.map(schedule => {
    const classData = schedule.class;
    const order = classData?.order;
    const bimbelPackage = order?.bimbelPackage;
    const groupType = order?.groupType;
    const tutor = classData?.tutor;
    const tutorGender = tutor?.tutors?.[0]?.gender;
    const tutorName = tutor ? getTutorName({ gender: tutorGender, user: { name: tutor.name } }) : null;

    const attendance = schedule.attendances?.find(a => a.userId === userId) || null;

    let status = attendance ? attendance.status : schedule.status;
    let waktuAbsen = null;

    if (attendance && attendance.status === "masuk" && attendance.createdAt) {
      waktuAbsen = attendance.createdAt;
      const scheduleDate = new Date(schedule.date);
      const attendanceDate = new Date(attendance.createdAt);
      const diffMs = attendanceDate - scheduleDate;
      const diffMinutes = diffMs / (1000 * 60);
      if (diffMinutes > 15) {
        status = "terlambat";
      }
    }

    return {
      id: schedule.id,
      classCode: classData.code,
      packageName: bimbelPackage?.name || null,
      level: bimbelPackage?.level || null,
      tutorName: tutorName,
      groupType: groupType?.type || null,
      meet: schedule.meet,
      date: schedule.date,
      endShow: schedule.endShow,
      duration: bimbelPackage?.duration || null,
      address: order?.address || null,
      info: schedule.information || null,
      status: status,
      waktuAbsen: waktuAbsen,
      photo: tutor?.tutors?.[0]?.photo || null,
      slug: schedule.slug || null,
    };
  });

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Get schedules for a student based on their user ID with pagination.
 *
 * @async
 * @function getSchedulesForStudent
 * @param {String} userId - The ID of the logged-in student.
 * @param {Number} page - The page number (default: 1).
 * @param {Number} limit - The number of items per page (default: 10).
 * @returns {Promise<Object>} The paginated schedules for the student.
 */
async function getSchedulesForStudent(userId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const studentClasses = await prisma.studentClass.findMany({
    where: { userId },
    select: { classId: true },
  });

  const classIds = studentClasses.map((sc) => sc.classId);

  if (classIds.length === 0) {
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }

  const runningClasses = await prisma.class.findMany({
    where: {
      id: { in: classIds },
      status: 'berjalan'
    },
    select: { id: true }
  });
  const runningClassIds = runningClasses.map(cls => cls.id);

  if (runningClassIds.length === 0) {
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }

  const now = new Date();
  now.setHours(now.getHours() + 7);

  const [totalUpcoming, totalPast] = await Promise.all([
    prisma.schedule.count({
      where: { classId: { in: runningClassIds }, endShow: { gte: now } }
    }),
    prisma.schedule.count({
      where: { classId: { in: runningClassIds }, endShow: { lt: now } }
    })
  ]);

  const total = totalUpcoming + totalPast;
  const totalPages = Math.ceil(total / limit);

  let schedules = [];
  if (offset < totalUpcoming) {
    const takeUpcoming = Math.min(limit, totalUpcoming - offset);
    const upcomingSchedules = await prisma.schedule.findMany({
      where: { classId: { in: runningClassIds }, endShow: { gte: now } },
      include: {
        class: {
          include: {
            order: { include: { bimbelPackage: true, groupType: true } },
            tutor: { include: { tutors: true } },
          },
        },
        attendances: {
          where: { userId },
          select: { status: true },
        },
      },
      orderBy: { date: 'asc' },
      skip: offset,
      take: takeUpcoming,
    });

    schedules = upcomingSchedules;

    if (takeUpcoming < limit) {
      const takePast = limit - takeUpcoming;
      const pastSchedules = await prisma.schedule.findMany({
        where: { classId: { in: runningClassIds }, endShow: { lt: now } },
        include: {
          class: {
            include: {
              order: { include: { bimbelPackage: true, groupType: true } },
              tutor: { include: { tutors: true } },
            },
          },
          attendances: {
            where: { userId },
            select: { status: true },
          },
        },
        orderBy: { date: 'asc' },
        skip: 0,
        take: takePast,
      });
      schedules = [...schedules, ...pastSchedules];
    }
  } else {
    const pastOffset = offset - totalUpcoming;
    schedules = await prisma.schedule.findMany({
      where: { classId: { in: runningClassIds }, endShow: { lt: now } },
      include: {
        class: {
          include: {
            order: { include: { bimbelPackage: true, groupType: true } },
            tutor: { include: { tutors: true } },
          },
        },
        attendances: {
          where: { userId },
          select: { status: true },
        },
      },
      orderBy: { date: 'asc' },
      skip: pastOffset,
      take: limit,
    });
  }

  const data = schedules.map((schedule) => {
    const classData = schedule.class;
    const order = classData?.order;
    const bimbelPackage = order?.bimbelPackage;
    const groupType = order?.groupType;
    const tutor = classData?.tutor;
    const tutorGender = tutor?.tutors?.[0]?.gender;
    const tutorName = tutor ? getTutorName({ gender: tutorGender, user: { name: tutor.name } }) : null;
    const attendance = schedule.attendances?.[0] || null;

    let status = attendance ? attendance.status : schedule.status;
    let waktuAbsen = null;

    if (attendance && attendance.status === "masuk" && attendance.createdAt) {
      waktuAbsen = attendance.createdAt;
      const scheduleDate = new Date(schedule.date);
      const attendanceDate = new Date(attendance.createdAt);
      const diffMs = attendanceDate - scheduleDate;
      const diffMinutes = diffMs / (1000 * 60);
      if (diffMinutes > 15) {
        status = "terlambat";
      }
    }

    return {
      id: schedule.id,
      classCode: classData.code,
      packageName: bimbelPackage?.name || null,
      level: bimbelPackage?.level || null,
      tutorName: tutorName,
      groupType: groupType?.type || null,
      meet: schedule.meet,
      date: schedule.date,
      endShow: schedule.endShow,
      duration: bimbelPackage?.duration || null,
      address: order?.address || null,
      info: schedule.information || null,
      status: status,
      waktuAbsen: waktuAbsen,
      photo: tutor?.tutors?.[0]?.photo || null,
      slug: schedule.slug || null,
    };
  });

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Get schedules for a tutor based on their user ID with pagination.
 *
 * @async
 * @function getSchedulesForTutor
 * @param {String} userId - The ID of the logged-in tutor.
 * @param {Number} page - The page number (default: 1).
 * @param {Number} limit - The number of items per page (default: 10).
 * @returns {Promise<Object>} The paginated schedules for the tutor.
 */
async function getSchedulesForTutor(userId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const runningClasses = await prisma.class.findMany({
    where: { tutorId: userId, status: 'berjalan' },
    select: { id: true }
  });
  const runningClassIds = runningClasses.map(cls => cls.id);

  if (runningClassIds.length === 0) {
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }

  const now = new Date();
  now.setHours(now.getHours() + 7);

  const [totalUpcoming, totalPast] = await Promise.all([
    prisma.schedule.count({
      where: { classId: { in: runningClassIds }, endShow: { gte: now } }
    }),
    prisma.schedule.count({
      where: { classId: { in: runningClassIds }, endShow: { lt: now } }
    })
  ]);

  const total = totalUpcoming + totalPast;
  const totalPages = Math.ceil(total / limit);

  let schedules = [];
  if (offset < totalUpcoming) {
    const takeUpcoming = Math.min(limit, totalUpcoming - offset);
    const upcomingSchedules = await prisma.schedule.findMany({
      where: { classId: { in: runningClassIds }, endShow: { gte: now } },
      include: {
        class: {
          include: {
            order: { include: { bimbelPackage: true, groupType: true } },
            tutor: { include: { tutors: true } },
          },
        },
        attendances: true,
      },
      orderBy: { date: 'asc' },
      skip: offset,
      take: takeUpcoming,
    });

    schedules = upcomingSchedules;

    if (takeUpcoming < limit) {
      const takePast = limit - takeUpcoming;
      const pastSchedules = await prisma.schedule.findMany({
        where: { classId: { in: runningClassIds }, endShow: { lt: now } },
        include: {
          class: {
            include: {
              order: { include: { bimbelPackage: true, groupType: true } },
              tutor: { include: { tutors: true } },
            },
          },
          attendances: true,
        },
        orderBy: { date: 'asc' },
        skip: 0,
        take: takePast,
      });
      schedules = [...schedules, ...pastSchedules];
    }
  } else {
    const pastOffset = offset - totalUpcoming;
    schedules = await prisma.schedule.findMany({
      where: { classId: { in: runningClassIds }, endShow: { lt: now } },
      include: {
        class: {
          include: {
            order: { include: { bimbelPackage: true, groupType: true } },
            tutor: { include: { tutors: true } },
          },
        },
        attendances: true,
      },
      orderBy: { date: 'asc' },
      skip: pastOffset,
      take: limit,
    });
  }

  const data = schedules.map((schedule) => {
    const classData = schedule.class;
    const order = classData?.order;
    const bimbelPackage = order?.bimbelPackage;
    const groupType = order?.groupType;
    const tutor = classData?.tutor;
    const tutorGender = tutor?.tutors?.[0]?.gender;
    const tutorName = tutor ? getTutorName({ gender: tutorGender, user: { name: tutor.name } }) : null;
    const attendance = schedule.attendances?.[0] || null;

    let status = attendance ? attendance.status : schedule.status;
    let waktuAbsen = null;

    if (attendance && attendance.createdAt) {
      waktuAbsen = attendance.createdAt;
      const scheduleDate = new Date(schedule.date);
      const attendanceDate = new Date(attendance.createdAt);
      const diffMs = attendanceDate - scheduleDate;
      const diffMinutes = diffMs / (1000 * 60);
      if (diffMinutes > 15) {
        status = "terlambat";
      }
    }

    return {
      id: schedule.id,
      classCode: classData.code,
      packageName: bimbelPackage?.name || null,
      level: bimbelPackage?.level || null,
      tutorName: tutorName,
      groupType: groupType?.type || null,
      meet: schedule.meet,
      date: schedule.date,
      endShow: schedule.endShow,
      duration: bimbelPackage?.duration || null,
      address: order?.address || null,
      info: schedule.information || null,
      status: status,
      photo: tutor?.tutors?.[0]?.photo || null,
      slug: schedule.slug || null,
    };
  });

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Get schedules for the logged-in user based on their role.
 *
 * @async
 * @function getSchedulesByRole
 * @param {String} userId - The ID of the logged-in user.
 * @returns {Promise<Array>} The schedules for the user.
 */
async function getSchedulesByRole(userId, page, limit) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { role } = user;

  if (role === 'siswa') {
    return await getSchedulesForStudent(userId, page, limit);
  } else if (role === 'tutor') {
    return await getSchedulesForTutor(userId, page, limit);
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
    where: { slug }, 
    include: {
      class: {
        include: {
          studentClasses: {
            include: {
              user: true
            }
          },
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
  const studentNames = classData?.studentClasses?.map(sc => sc.user?.name).filter(Boolean) || [];

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
    studentName: studentNames,
    slug: schedule.slug || null,
  };
}

/**
 * Get the closest schedule for a specific bimbel package slug from today.
 *
 * @async
 * @function getClosestScheduleBySlug
 * @param {String} slug - The slug of the bimbel package.
 * @returns {Promise<Object>} The closest schedule detail.
 * @throws {Error} If no schedule is found.
 */
async function getClosestScheduleBySlug(slug) {
  const today = new Date();

  const schedules = await prisma.schedule.findMany({
    where: {
      class: {
        order: {
          bimbelPackage: {
            slug: slug 
          }
        }
      },
      date: {
        gte: today
      }
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
      attendances: true
    },
    orderBy: {
      date: 'asc' 
    },
    take: 5 
  });

  if (!schedules || schedules.length === 0) {
    throw new Error('No upcoming schedules found for the given bimbel package slug');
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
      slug: bimbelPackage?.slug || null
    };
  });
}

/**
 * Get all schedules for a student by userId (no pagination)
 * @param {String} userId
 * @returns {Promise<Array>}
 */
async function getScheduleByUserId(userId) {
  const studentClasses = await prisma.studentClass.findMany({
    where: { userId },
    select: { classId: true }
  });
  const classIds = studentClasses.map(sc => sc.classId);

  if (classIds.length === 0) return [];

  const today = new Date();
  const schedules = await prisma.schedule.findMany({
    where: {
      classId: { in: classIds },
      date: { gte: today }
    },
    include: {
      class: {
        include: {
          order: {
            include: {
              bimbelPackage: true,
              groupType: true,
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
    orderBy: { date: 'asc' },
    take: 5
  });

  return schedules.map(schedule => {
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
      status: attendance ? attendance.status : schedule.status,
    };
  });
}

/**
 * Get highlight schedule: jadwal terdekat yang belum terlewat,
 * hanya muncul jika sekarang minimal 1 jam sebelum jadwal dimulai.
 * 
 * @async
 * @function getHighlightSchedule
 * @param {String} userId - (optional) filter by student/tutor userId
 * @returns {Promise<Object|null>} Jadwal highlight atau null jika tidak ada
 */
async function getHighlightSchedule(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (!user) return null;

  const now = new Date();
  now.setHours(now.getHours() + 7);

  let classIds = [];

  if (user.role === 'siswa') {
    const studentClasses = await prisma.studentClass.findMany({
      where: { userId },
      select: { classId: true }
    });
    classIds = studentClasses.map(sc => sc.classId);
    if (classIds.length === 0) return null;
  } else if (user.role === 'tutor') {
    const tutorClasses = await prisma.class.findMany({
      where: { tutorId: userId },
      select: { id: true }
    });
    classIds = tutorClasses.map(cls => cls.id);
    if (classIds.length === 0) return null;
  } else {
    return null;
  }

  const nextSchedule = await prisma.schedule.findFirst({
    where: {
      classId: { in: classIds },
      date: { gte: now }
    },
    include: {
      class: {
        include: {
          order: { include: { bimbelPackage: true, groupType: true } },
          tutor: { include: { tutors: true } }
        }
      },
      attendances: {
        where: { userId },
        select: { status: true, createdAt: true, userId: true }
      }
    },
    orderBy: { date: 'asc' }
  });

  if (nextSchedule) {
    const diffMs = new Date(nextSchedule.date) - now;
    if (diffMs <= 3600000 && diffMs > 0) {
      return mapScheduleHighlight(nextSchedule, userId);
    }
  }
  
  const prevSchedule = await prisma.schedule.findFirst({
    where: {
      classId: { in: classIds },
      date: { lt: now }
    },
    include: {
      class: {
        include: {
          order: { include: { bimbelPackage: true, groupType: true } },
          tutor: { include: { tutors: true } }
        }
      },
      attendances: {
        where: { userId },
        select: { status: true, createdAt: true, userId: true }
      }
    },
    orderBy: { date: 'desc' }
  });

  if (prevSchedule) {
    return mapScheduleHighlight(prevSchedule, userId);
  }

  return null;
}

function mapScheduleHighlight(schedule, userId) {
  const classData = schedule.class;
  const order = classData?.order;
  const bimbelPackage = order?.bimbelPackage;
  const groupType = order?.groupType;
  const tutor = classData?.tutor;
  const tutorGender = tutor?.tutors?.[0]?.gender;
  const tutorName = tutor ? getTutorName({ gender: tutorGender, user: { name: tutor.name } }) : null;

  let attendanceStatus = schedule.status;
  let attendanceCreatedAt = null;
  if (schedule.attendances && schedule.attendances.length > 0) {
    const userAttendance = schedule.attendances.find(a => a.userId === userId);
    if (userAttendance) {
      attendanceStatus = userAttendance.status;
      attendanceCreatedAt = userAttendance.createdAt || null;

      if (
        userAttendance.status === "masuk" &&
        userAttendance.createdAt
      ) {
        const scheduleDate = new Date(schedule.date);
        const attendanceDate = new Date(userAttendance.createdAt);
        const diffMs = attendanceDate - scheduleDate;
        const diffMinutes = diffMs / (1000 * 60);
        if (diffMinutes > 15) {
          attendanceStatus = "terlambat";
        }
      }
    }
  }

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
    status: attendanceStatus,
    waktuAbsen: attendanceCreatedAt,
    photo: tutor?.tutors?.[0]?.photo || null,
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
  getTutorName,
  getClosestScheduleBySlug,
  getScheduleByUserId,
  getHighlightSchedule
};