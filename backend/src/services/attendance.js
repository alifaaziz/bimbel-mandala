import { prisma } from '../utils/db.js';
import { SalaryService } from './salary.js';

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
 * Utility function to calculate payroll for a tutor.
 *
 * @param {Object} order - The order object containing groupType and price.
 * @param {number} totalAttendanceMasuk - The total number of "masuk" attendances.
 * @param {number} totalSchedules - The total number of schedules.
 * @returns {number} The calculated payroll.
 */
function calculatePayroll(order, totalAttendanceMasuk, totalSchedules) {
  const salary = (order?.groupType?.price || 0) * 0.9;
  const totalAttendancePercentage = totalSchedules > 0 ? (totalAttendanceMasuk / totalSchedules) * 100 : 0;
  return salary * (totalAttendancePercentage / 100);
}

/**
 * Checks if the given schedule is the last schedule in the class.
 *
 * @param {Object} schedule - The current schedule.
 * @param {Array} schedules - The list of all schedules in the class.
 * @returns {boolean} True if the schedule is the last one, false otherwise.
 */
function isLastSchedule(schedule, schedules) {
  return schedule.meet === schedules.length;
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
  const attendance = await prisma.attendance.create({
    data: {
      scheduleId,
      userId,
      status,
      reason
    }
  });

  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      class: {
        include: {
          tutor: true,
          order: {
            include: {
              groupType: {
                select: {
                  price: true
                }
              }
            }
          },
          schedules: {
            include: {
              attendances: true
            }
          }
        }
      }
    }
  });

  const { class: classData } = schedule;
  const { schedules, order, tutor } = classData;

  if (isLastSchedule(schedule, schedules) && tutor?.id === userId) {
    const tutorAttendance = schedules.flatMap(s => s.attendances.filter(att => att.userId === userId));
    const totalAttendanceMasuk = tutorAttendance.filter(att => att.status === 'masuk').length;

    const payroll = calculatePayroll(order, totalAttendanceMasuk, schedules.length);

    await SalaryService.createSalary({
      tutorId: userId,
      orderId: order?.id,
      totalSalary: payroll
    });
  }

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
 * Retrieves attendance statistics for all classes.
 *
 * @async
 * @function getAttendanceStatistics
 * @returns {Promise<Array>} The attendance statistics for all classes.
 */
async function getAttendanceStatistics() {
  const classes = await prisma.class.findMany({
    where:{
      status: 'selesai'
    },
    include: {
      tutor: true,
      studentClasses: {
        include: {
          user: true
        }
      },
      schedules: {
        include: {
          attendances: true
        }
      }
    }
  });

  return classes.map(classData => {
    const { tutor, studentClasses, schedules } = classData;

    const tutorStats = tutor
      ? calculateAttendanceStats(schedules.flatMap(s => s.attendances), tutor.id)
      : null;

    const studentStats = studentClasses.map(studentClass => {
      return calculateAttendanceStats(
        schedules.flatMap(s => s.attendances),
        studentClass.user.id
      );
    });

    return {
      classId: classData.id,
      classCode: classData.code,
      tutorStats,
      studentStats
    };
  });
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
        const { schedules, order } = classData;

        const tutorAttendance = schedules.flatMap(schedule =>
          schedule.attendances.filter(att => att.userId === user.id)
        );

        const totalAttendanceMasuk = tutorAttendance.filter(att => att.status === 'masuk').length;

        const salary = (order?.groupType?.price || 0) * 0.9;
        const totalAttendancePercentage = (totalAttendanceMasuk / schedules.length) * 100;
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

        const tutorStats = {
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

        return {
          classId: classData.id,
          classCode: classData.code,
          bimbelPackage: {
            name: order?.bimbelPackage?.name || null,
            level: order?.bimbelPackage?.level || null,
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

      const totalAttendanceMasuk = studentAttendance.filter(att => att.status === 'masuk').length;
      const totalAttendancePercentage = (totalAttendanceMasuk / schedules.length) * 100;

      const studentStats = {
        ...calculateAttendanceStats(studentAttendance, user.id),
        totalSchedules: schedules.length,
        scheduleProgress: totalAttendancePercentage,
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

export const AttendanceService = {
  createAttendance,
  markAlphaForMissedSchedules,
  getAttendanceStatistics,
  getMyAttendanceStatistics
};