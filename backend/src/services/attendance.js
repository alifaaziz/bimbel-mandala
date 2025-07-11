import { prisma } from '../utils/db.js';

const SALARY_PERCENTAGE = 0.9;

/**
 * Utility function to calculate attendance statistics.
 *
 * @param {Array} attendances - The list of attendance records.
 * @param {string} userId - The user ID.
 * @returns {Object} The attendance statistics (masuk, izin, alpha).
 */
function calculateAttendanceStats(attendances, userId) {
  const userAttendance = attendances.filter(att => att.userId === userId);
  return {
    masuk: userAttendance.filter(att => att.status === 'masuk').length,
    izin: userAttendance.filter(att => att.status === 'izin').length,
    alpha: userAttendance.filter(att => att.status === 'alpha').length
  };
}

/**
 * Helper to calculate attendance percentage.
 *
 * @param {number} totalMasuk - The total number of "masuk" attendances.
 * @param {number} totalSchedules - The total number of schedules.
 * @returns {number} The attendance percentage.
 */
function calculateAttendancePercentage(totalMasuk, totalSchedules) {
  return totalSchedules > 0 ? (totalMasuk / totalSchedules) * 100 : 0;
}

/**
 * Helper to get tutor attendance and payroll stats.
 *
 * @async
 * @function getTutorStats
 * @param {Object} params - The parameters object.
 * @param {Array} params.schedules - The list of schedules.
 * @param {Object} params.order - The order object.
 * @param {Object} params.user - The user object.
 * @returns {Promise<Object>} The tutor statistics.
 */
async function getTutorStats({ schedules, order, user }) {
  const tutorAttendance = schedules.flatMap(schedule =>
    schedule.attendances.filter(att => att.userId === user.id)
  );
  const totalAttendanceMasuk = tutorAttendance.filter(att => att.status === 'masuk').length;
  const totalAttendancePercentage = calculateAttendancePercentage(totalAttendanceMasuk, schedules.length);
  const salary = (order?.groupType?.price || 0) * SALARY_PERCENTAGE;
  const payroll = salary * (totalAttendancePercentage / 100);

  const salaryRecord = await prisma.salary.findFirst({
    where: {
      userId: user.id,
      orderId: order?.id
    },
    select: {
      status: true
    }
  });

  return {
    tutorId: user.id,
    name: user.name,
    ...calculateAttendanceStats(tutorAttendance, user.id),
    totalSchedules: schedules.length,
    scheduleProgress: totalAttendancePercentage,
    totalAttendance: totalAttendancePercentage,
    salary,
    payroll,
    status: salaryRecord?.status || 'pending'
  };
}

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
async function createAttendance({ scheduleId, userId, status, reason = null }) {
  const existing = await prisma.attendance.findFirst({
    where: {
      scheduleId,
      userId
    }
  });

  if (existing) {
    throw new Error('Attendance can only be done once');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      class: { include: { tutor: true } }
    }
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  const today = new Date();
  const scheduleDate = new Date(schedule.date);
  if (
    scheduleDate.getFullYear() !== today.getFullYear() ||
    scheduleDate.getMonth() !== today.getMonth() ||
    scheduleDate.getDate() !== today.getDate()
  ) {
    throw new Error('Attendance can only be done on the schedule date');
  }

  if (user.role === 'siswa' && status === 'masuk') {
    const tutorId = schedule.class.tutor?.id;
    if (tutorId) {
      const tutorAttendance = await prisma.attendance.findFirst({
        where: {
          scheduleId,
          userId: tutorId,
          status: 'masuk'
        }
      });
      if (!tutorAttendance) {
        throw new Error('Tutors must take attendance first');
      }
    }
  }

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
async function markAlphaForMissedSchedules() {
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

/**
 * Retrieves attendance statistics for the logged-in user.
 *
 * @async
 * @function getMyAttendanceStatistics
 * @param {Object} user - The logged-in user object.
 * @returns {Promise<Array>} The attendance statistics for the user's classes.
 */
async function getMyAttendanceStatistics(user) {
  if (user.role === 'tutor') {
    const classes = await prisma.class.findMany({
      where: {
        tutorId: user.id,
        status: 'selesai'
      },
      include: {
        schedules: {
          include: {
            attendances: true
          }
        },
        order: {
          include: {
            groupType: {
              select: {
                price: true
              }
            },
            bimbelPackage: {
              select: {
                name: true,
                level: true,
              }
            }
          }
        }
      }
    });

    return Promise.all(
      classes.map(async classData => {
        const tutorStats = await getTutorStats({
          schedules: classData.schedules,
          order: classData.order,
          user
        });

        return {
          classId: classData.id,
          classCode: classData.code,
          bimbelPackage: {
            name: classData.order?.bimbelPackage?.name || null,
            level: classData.order?.bimbelPackage?.level || null,
          },
          tutorStats
        };
      })
    );
  } else if (user.role === 'siswa') {
    const studentClasses = await prisma.studentClass.findMany({
      where: {
        userId: user.id,
        class: {
          status: 'selesai'
        }
      },
      include: {
        class: {
          include: {
            schedules: {
              include: {
                attendances: true
              }
            },
            tutor: true,
            order: {
              include: {
                bimbelPackage: {
                  select: {
                    name: true,
                    level: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    return studentClasses.map(studentClass => {
      const { class: classData } = studentClass;
      const { schedules, tutor, order } = classData;

      const studentAttendance = schedules.flatMap(schedule =>
        schedule.attendances.filter(att => att.userId === user.id)
      );

      const stats = calculateAttendanceStats(studentAttendance, user.id);
      const totalSchedules = schedules.length;
      const scheduleProgress = totalSchedules > 0
        ? ((stats.masuk + stats.izin + stats.alpha) / totalSchedules) * 100
        : 0;
      const totalAttendancePercentage = calculateAttendancePercentage(stats.masuk, totalSchedules);

      const studentStats = {
        ...stats,
        totalSchedules,
        scheduleProgress,
        totalAttendance: totalAttendancePercentage
      };

      const tutorStats = tutor
        ? {
            ...calculateAttendanceStats(
              schedules.flatMap(schedule => schedule.attendances),
              tutor.id
            ),
            tutorId: tutor.id,
            name: tutor.name 
          }
        : null;

      return {
        classId: classData.id,
        classCode: classData.code,
        bimbelPackage: {
          name: order?.bimbelPackage?.name || null,
          level: order?.bimbelPackage?.level || null,
        },
        tutorStats,
        studentStats
      };
    });
  } else {
    throw new Error('Role not supported for this operation');
  }
}

/**
 * Rekap detail satu kelas untuk kebutuhan rekap PDF
 * @param {string} classId
 * @returns {Promise<Object>}
 */
async function getRekapKelasById(classId) {
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      schedules: {
        include: {
          attendances: true
        }
      },
      tutor: true,
      order: {
        include: {
          groupType: { select: { price: true } },
          bimbelPackage: {
            select: {
              name: true,
              level: true,
            }
          }
        }
      },
      studentClasses: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });

  if (!classData) throw new Error('Kelas tidak ditemukan');

  // Gunakan getTutorStats agar payload tutor konsisten
  let tutorStats = null;
  if (classData.tutor) {
    tutorStats = await getTutorStats({
      schedules: classData.schedules,
      order: classData.order,
      user: classData.tutor
    });
  }

  // Student stats
  const schedules = classData.schedules;
  const allAttendances = schedules.flatMap(s => s.attendances);
  const students = classData.studentClasses.map(sc => {
    const stats = calculateAttendanceStats(allAttendances, sc.user.id);
    return {
      name: sc.user.name,
      hadir: stats.masuk,
      izin: stats.izin,
      absen: stats.alpha
    };
  });

  return {
    name: classData.order?.bimbelPackage?.name || '',
    level: classData.order?.bimbelPackage?.level || '',
    classCode: classData.code,
    tutorStats, // gunakan hasil getTutorStats
    students,
    pertemuan: tutorStats?.totalSchedules || 0,
    kosong: (tutorStats?.izin || 0) + (tutorStats?.alpha || 0),
    progress: tutorStats?.scheduleProgress || 0,
    absensi: tutorStats?.totalAttendance || 0
  };
}

/**
 * Creates an izin notification.
 *
 * @async
 * @function createIzinNotification
 * @param {Object} data - The notification data.
 * @param {string} data.scheduleId - The schedule ID.
 * @param {string} data.userId - The user ID.
 * @param {string} data.reason - The reason for izin.
 * @returns {Promise<void>}
 */
async function createIzinNotification({ scheduleId, userId, reason }) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      class: {
        include: {
          order: { include: { bimbelPackage: true } },
          tutor: { include: { tutors: true } },
          studentClasses: { include: { user: true } }
        }
      }
    }
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const tutor = schedule.class.tutor;
  const bimbelPackage = schedule.class.order.bimbelPackage;
  const classCode = schedule.class.code;
  const siswaList = schedule.class.studentClasses.map(sc => sc.user);
  const tutorPhoto = schedule.class.tutor?.tutors?.[0]?.photo || null;

  if (tutor && userId === tutor.id) {
    for (const siswa of siswaList) {
      await prisma.notification.create({
        data: {
          userId: siswa.id,
          type: "Izin",
          description: `<strong>${tutor.name}</strong> (tutor) melakukan izin pada <strong>${bimbelPackage.name} ${bimbelPackage.level} #${classCode}</strong>`,
          reason,
          photo: tutorPhoto
        }
      });
    }
  } else if (tutor) {
    await prisma.notification.create({
      data: {
        userId: tutor.id,
        type: "Izin",
        description: `<strong>${user.name}</strong> melakukan izin pada <strong>${bimbelPackage.name} ${bimbelPackage.level} #${classCode}</strong>`,
        reason,
        photo: tutorPhoto
      }
    });
  }
}

/**
 * Creates a "masuk" (present) notification.
 *
 * @async
 * @function createMasukNotification
 * @param {Object} data - The notification data.
 * @param {string} data.scheduleId - The schedule ID.
 * @param {string} data.userId - The user ID.
 * @returns {Promise<void>}
 */
async function createMasukNotification({ scheduleId, userId }) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      class: {
        include: {
          order: { include: { bimbelPackage: true } },
          tutor: { include: { tutors: true } },
          studentClasses: { include: { user: true } }
        }
      }
    }
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const tutor = schedule.class.tutor;
  const bimbelPackage = schedule.class.order.bimbelPackage;
  const classCode = schedule.class.code;
  const siswaList = schedule.class.studentClasses.map(sc => sc.user);
  const tutorPhoto = schedule.class.tutor?.tutors?.[0]?.photo || null;

  if (tutor && userId !== tutor.id) {
    await prisma.notification.create({
      data: {
        userId: tutor.id,
        type: "Absensi",
        description: `<strong>${user.name}</strong> melakukan absen masuk pada <strong>${bimbelPackage.name} ${bimbelPackage.level} #${classCode}</strong>`,
        photo: tutorPhoto
      }
    });
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "Absensi",
        description: `<strong>Anda</strong> melakukan absen masuk pada <strong>${bimbelPackage.name} ${bimbelPackage.level} #${classCode}</strong>`,
        photo: tutorPhoto
      }
    });
  }

  else if (tutor && userId === tutor.id) {
    for (const siswa of siswaList) {

      await prisma.notification.create({
        data: {
          userId: siswa.id,
          type: "Absensi",
          description: `<strong>${tutor.name}</strong> (tutor) memulai pembelajaran <strong>${bimbelPackage.name} ${bimbelPackage.level} #${classCode}</strong>`,
          photo: tutorPhoto
        }
      });
    }
    await prisma.notification.create({
      data: {
        userId: tutor.id,
        type: "Absensi",
        description: `<strong>Anda</strong> melakukan absen masuk pada <strong>${bimbelPackage.name} ${bimbelPackage.level} #${classCode}</strong>`,
        photo: tutorPhoto
      }
    });
  }
}

export const AttendanceService = {
  createAttendance,
  markAlphaForMissedSchedules,
  getMyAttendanceStatistics,
  getRekapKelasById,
  createIzinNotification,
  createMasukNotification
};