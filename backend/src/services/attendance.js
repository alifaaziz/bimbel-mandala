import { prisma } from '../utils/db.js';
import { SalaryService } from './salary.js';

/**
 * Utility function to calculate attendance statistics.
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
 */
function calculateAttendancePercentage(totalMasuk, totalSchedules) {
  return totalSchedules > 0 ? (totalMasuk / totalSchedules) * 100 : 0;
}

/**
 * Helper to get tutor attendance and payroll stats.
 */
async function getTutorStats({ schedules, order, user }) {
  const tutorAttendance = schedules.flatMap(schedule =>
    schedule.attendances.filter(att => att.userId === user.id)
  );
  const totalAttendanceMasuk = tutorAttendance.filter(att => att.status === 'masuk').length;
  const totalSchedules = schedules.length;
  const scheduleProgress = calculateAttendancePercentage(totalAttendanceMasuk, totalSchedules);

  const salaryRecord = await prisma.salary.findFirst({
    where: {
      userId: user.id,
      orderId: order?.id
    },
    select: {
      status: true,
      total: true,
      payroll: true
    }
  });

  let salary, payroll;
  if (salaryRecord) {
    salary = salaryRecord.total;
    payroll = salaryRecord.payroll;
  } else {
    const price = Number(order?.amount) || 0;
    const tutor = await prisma.tutor.findUnique({
      where: { userId: user.id }
    });
    const percent = tutor?.percent ? Number(tutor.percent) / 100 : 0.6;
    const hadirPersen = totalSchedules > 0 ? totalAttendanceMasuk / totalSchedules : 0;
    const totalSalary = price * percent;
    salary = totalSalary;
    payroll = totalSalary * hadirPersen;
  }

  return {
    tutorId: user.id,
    name: user.name,
    ...calculateAttendanceStats(tutorAttendance, user.id),
    totalSchedules,
    scheduleProgress,
    totalAttendance: scheduleProgress,
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

  // if (user.role === 'siswa' && status === 'masuk') {
  //   const tutorId = schedule.class.tutor?.id;
  //   if (tutorId) {
  //     const tutorAttendance = await prisma.attendance.findFirst({
  //       where: {
  //         scheduleId,
  //         userId: tutorId,
  //         status: 'masuk'
  //       }
  //     });
  //     if (!tutorAttendance) {
  //       throw new Error('Tutors must take attendance first');
  //     }
  //   }
  // }

  const attendance = await prisma.attendance.create({
    data: {
      scheduleId,
      userId,
      status,
      reason
    }
  });

  await createSalaryIfLastAttendance(schedule.class.id);

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
      date: { lt: now }
    },
    include: {
      class: {
        include: {
          studentClasses: { include: { user: true } },
          tutor: true
        }
      },
      attendances: true
    }
  });

  for (const schedule of schedules) {
    const { id: scheduleId, class: { studentClasses, tutor }, attendances } = schedule;

    const attendedUserIds = new Set(attendances.map(a => a.userId));

    for (const studentClass of studentClasses) {
      const userId = studentClass.user.id;
      if (!attendedUserIds.has(userId)) {
        await prisma.attendance.create({
          data: {
            scheduleId,
            userId,
            status: 'alpha',
            reason: null
          }
        });
      }
    }

    if (tutor && !attendedUserIds.has(tutor.id)) {
      await prisma.attendance.create({
        data: {
          scheduleId,
          userId: tutor.id,
          status: 'alpha',
          reason: null
        }
      });
    }

    await createSalaryIfLastAttendance(schedule.class.id);
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
        studentClasses: {
          include: {
            user: true
          }
        },
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
    });

    return Promise.all(
      classes.map(async classData => {
        const tutorStats = await getTutorStats({
          schedules: classData.schedules,
          order: classData.order,
          user
        });
        const schedules = classData.schedules;
        const siswaIds = classData.studentClasses.map(sc => sc.user.id);

        let kosong = 0;
        for (const schedule of schedules) {
          const attendances = schedule.attendances;
          const tutorMasuk = attendances.some(att => att.userId === user.id && att.status === 'masuk');
          const siswaTidakMasuk = siswaIds.every(siswaId =>
            !attendances.some(att => att.userId === siswaId && att.status === 'masuk')
          );
          if (tutorMasuk && siswaTidakMasuk) kosong++;
        }

        const totalPertemuan = schedules.length;
        const kesesuaian = totalPertemuan > 0 ? ((totalPertemuan - kosong) / totalPertemuan) * 100 : 0;

        return {
          classId: classData.id,
          classCode: classData.code,
          bimbelPackage: {
            name: classData.order?.bimbelPackage?.name || null,
            level: classData.order?.bimbelPackage?.level || null,
          },
          tutorStats,
          kosong,
          kesesuaian 
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
            studentClasses: {
              include: {
                user: true
              }
            },
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
      const { schedules, tutor, order, studentClasses: allStudentClasses } = classData;
      const siswaIds = allStudentClasses.map(sc => sc.user.id);

      let kosong = 0;
      for (const schedule of schedules) {
        const attendances = schedule.attendances;
        const tutorMasuk = tutor && attendances.some(att => att.userId === tutor.id && att.status === 'masuk');
        const siswaTidakMasuk = siswaIds.every(siswaId =>
          !attendances.some(att => att.userId === siswaId && att.status === 'masuk')
        );
        if (tutorMasuk && siswaTidakMasuk) kosong++;
      }

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
        studentStats,
        kosong 
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

  let tutorStats = null;
  if (classData.tutor) {
    tutorStats = await getTutorStats({
      schedules: classData.schedules,
      order: classData.order,
      user: classData.tutor
    });
  }

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

  const siswaIds = classData.studentClasses.map(sc => sc.user.id);
  let kosong = 0;
  for (const schedule of schedules) {
    const attendances = schedule.attendances;
    const tutorMasuk = classData.tutor && attendances.some(att => att.userId === classData.tutor.id && att.status === 'masuk');
    const siswaTidakMasuk = siswaIds.every(siswaId =>
      !attendances.some(att => att.userId === siswaId && att.status === 'masuk')
    );
    if (tutorMasuk && siswaTidakMasuk) kosong++;
  }

  const totalPertemuan = schedules.length;
  const kesesuaian = totalPertemuan > 0 ? ((totalPertemuan - kosong) / totalPertemuan) * 100 : 0;

  return {
    name: classData.order?.bimbelPackage?.name || '',
    level: classData.order?.bimbelPackage?.level || '',
    classCode: classData.code,
    tutorStats,
    students,
    pertemuan: tutorStats?.totalSchedules || 0,
    kosong,
    kesesuaian,
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

/**
 * Cek dan create salary jika attendance terakhir pada schedule terakhir
 * @param {string} classId
 */
async function createSalaryIfLastAttendance(classId) {
  const schedules = await prisma.schedule.findMany({
    where: { classId },
    orderBy: { date: 'asc' }
  });
  if (!schedules.length) return;

  const lastSchedule = schedules[schedules.length - 1];

  const attendances = await prisma.attendance.findMany({
    where: { scheduleId: lastSchedule.id }
  });

  const classData = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      tutor: { select: { id: true } },
      studentClasses: { select: { userId: true } },
      order: { select: { id: true, amount: true } }
    }
  });

  if (!classData?.order) return;

  const tutorId = classData.tutor?.id;
  const orderId = classData.order.id;
  const price = Number(classData.order.amount) || 0;
  const studentIds = classData.studentClasses.map(sc => sc.userId);

  const requiredUserIds = tutorId ? [tutorId, ...studentIds] : studentIds;

  const attendedUserIds = attendances.map(a => a.userId);
  const allAttended = requiredUserIds.every(uid => attendedUserIds.includes(uid));
  if (!allAttended) return;

  const existingSalary = await prisma.salary.findFirst({
    where: { userId: tutorId, orderId }
  });
  if (existingSalary) return;

  const tutor = await prisma.tutor.findUnique({
    where: { userId: tutorId }
  });
  const percent = tutor?.percent ? Number(tutor.percent) / 100 : 0.6;

  const totalSchedules = schedules.length;
  const hadirCount = await prisma.attendance.count({
    where: {
      userId: tutorId,
      scheduleId: { in: schedules.map(s => s.id) },
      status: 'masuk'
    }
  });
  const hadirPersen = totalSchedules > 0 ? hadirCount / totalSchedules : 0;

  const totalSalary = price * percent;
  const payroll = totalSalary * hadirPersen;

  await SalaryService.createSalary({
    tutorId,
    orderId,
    totalSalary,
    payroll
  });

  await prisma.class.update({
    where: { id: classId },
    data: { status: 'selesai' }
  });

  const orderDetail = await prisma.order.findUnique({
    where: { id: orderId },
    select: { packageId: true }
  });
  if (orderDetail?.packageId) {
    await prisma.bimbelPackage.update({
      where: { id: orderDetail.packageId },
      data: { isActive: true }
    });
  }
}

/**
 * Mengumpulkan alert attendance untuk tutor yang telat absen masuk > 5 menit dan jadwal kosong.
 * @param {string} classId
 * @returns {Promise<Array>} Array of alert objects
 */
async function alertAttendance(classId) {
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      tutor: { select: { id: true } },
      studentClasses: { select: { user: { select: { id: true } } } },
      schedules: {
        select: {
          date: true,
          meet: true,
          attendances: {
            select: {
              userId: true,
              status: true,
              createdAt: true
            }
          }
        }
      }
    }
  });

  if (!classData || !classData.tutor) return [];

  const tutorId = classData.tutor.id;
  const siswaIds = classData.studentClasses.map(sc => sc.user.id);

  const alerts = [];

  for (const schedule of classData.schedules) {
    const attendances = schedule.attendances;

    const tutorAttendance = attendances.find(att => att.userId === tutorId && att.status === 'masuk');
    if (tutorAttendance) {
      const waktuAbsen = tutorAttendance.createdAt
      const jadwalMulai = new Date(schedule.date);
      const waktuAbsenDate = new Date(waktuAbsen);
      waktuAbsenDate.setHours(waktuAbsenDate.getHours() - 7);

      const selisihMenit = Math.floor((waktuAbsenDate - jadwalMulai) / 60000);
      if (selisihMenit > 5) {
        alerts.push({
          tanggal: jadwalMulai.toISOString().slice(0, 10),
          meet: schedule.meet,
          waktuAbsen: waktuAbsenDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          status: 'Potensi Terlambat',
          keterangan: `Tutor terlambat ${selisihMenit} menit`
        });
      }
      const tutorMasuk = tutorAttendance !== undefined;
      const siswaTidakMasuk = siswaIds.every(siswaId =>
        !attendances.some(att => att.userId === siswaId && att.status === 'masuk')
      );
      const now = new Date();
      const missedOut = (now - jadwalMulai) > (24 * 60 * 60 * 1000);
      if (
        tutorMasuk &&
        siswaTidakMasuk &&
        missedOut
      ) {
        alerts.push({
          tanggal: jadwalMulai.toISOString().slice(0, 10),
          meet: schedule.meet,
          waktuAbsen: waktuAbsenDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          status: 'Potensi Pembatalan Sepihak',
          keterangan: 'Semua siswa dalam kelas tidak melakukan absensi'
        });
      }
    }

  }
  

  return alerts;
}

export const AttendanceService = {
  createAttendance,
  markAlphaForMissedSchedules,
  getMyAttendanceStatistics,
  getRekapKelasById,
  createIzinNotification,
  createMasukNotification,
  createSalaryIfLastAttendance,
  alertAttendance
};