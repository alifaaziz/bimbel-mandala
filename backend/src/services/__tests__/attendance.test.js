import { jest } from '@jest/globals';
import { generatePrismaMock } from '../../utils/jest.js';

const mockPrisma = generatePrismaMock();

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: mockPrisma.prisma,
}));

const { AttendanceService } = await import('../attendance.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AttendanceService', () => {
  describe('createAttendance', () => {
    it('should create a new attendance record', async () => {
      mockPrisma.prisma.attendance.findFirst
        .mockResolvedValueOnce(null) // No existing attendance for the user
        .mockResolvedValueOnce({ id: 'tutorAttendance1', status: 'masuk' }); // Tutor has taken attendance
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'user1', role: 'siswa' });
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule1',
        date: new Date().toISOString(),
        class: { tutor: { id: 'tutor1' } },
      });
      mockPrisma.prisma.attendance.create.mockResolvedValueOnce({ id: 'attendance1' });

      const result = await AttendanceService.createAttendance({
        scheduleId: 'schedule1',
        userId: 'user1',
        status: 'masuk',
      });

      expect(mockPrisma.prisma.attendance.findFirst).toHaveBeenCalledWith({
        where: { scheduleId: 'schedule1', userId: 'user1' },
      });
      expect(mockPrisma.prisma.attendance.findFirst).toHaveBeenCalledWith({
        where: { scheduleId: 'schedule1', userId: 'tutor1', status: 'masuk' },
      });
      expect(mockPrisma.prisma.attendance.create).toHaveBeenCalledWith({
        data: { scheduleId: 'schedule1', userId: 'user1', status: 'masuk', reason: null },
      });
      expect(result).toEqual({ id: 'attendance1' });
    });

    it('should throw an error if attendance already exists', async () => {
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce({ id: 'attendance1' });

      await expect(
        AttendanceService.createAttendance({
          scheduleId: 'schedule1',
          userId: 'user1',
          status: 'masuk',
        })
      ).rejects.toThrow('Attendance can only be done once');
    });

    it('should throw an error if schedule is not found', async () => {
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce(null); // No existing attendance
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'user1', role: 'siswa' });
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce(null); // Schedule not found

      await expect(
      AttendanceService.createAttendance({
        scheduleId: 'schedule1',
        userId: 'user1',
        status: 'masuk',
      })
      ).rejects.toThrow('Schedule not found');
    });

    it('should throw an error if attendance is not on the schedule date', async () => {
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce(null); // No existing attendance
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'user1', role: 'siswa' });
      // Set schedule date to yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
      id: 'schedule1',
      date: yesterday.toISOString(),
      class: { tutor: { id: 'tutor1' } },
      });

      await expect(
      AttendanceService.createAttendance({
        scheduleId: 'schedule1',
        userId: 'user1',
        status: 'masuk',
      })
      ).rejects.toThrow('Attendance can only be done on the schedule date');
    });

    it('should throw an error if tutor has not taken attendance yet for siswa masuk', async () => {
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce(null); // No existing attendance for the user
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'user1', role: 'siswa' });
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
      id: 'schedule1',
      date: new Date().toISOString(),
      class: { tutor: { id: 'tutor1' } },
      });
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce(null); // Tutor has NOT taken attendance

      await expect(
      AttendanceService.createAttendance({
        scheduleId: 'schedule1',
        userId: 'user1',
        status: 'masuk',
      })
      ).rejects.toThrow('Tutors must take attendance first');
    });
  });

  describe('markAlphaForMissedSchedules', () => {
    it('should mark alpha for missed schedules', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            studentClasses: [{ user: { id: 'student1' } }],
            tutorId: 'tutor1',
          },
        },
      ]);
      mockPrisma.prisma.attendance.create.mockResolvedValueOnce({});

      await AttendanceService.markAlphaForMissedSchedules();

      expect(mockPrisma.prisma.schedule.findMany).toHaveBeenCalledWith({
        where: {
          date: { lt: expect.any(Date) },
          attendances: { none: {} },
        },
        include: {
          class: {
            include: {
              studentClasses: { include: { user: true } },
              tutor: true,
            },
          },
        },
      });
      expect(mockPrisma.prisma.attendance.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAttendanceStatistics', () => {
    it('should return attendance statistics for all classes', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          id: 'class1',
          code: 'CLS1',
          tutor: { id: 'tutor1', name: 'Tutor A' },
          studentClasses: [{ user: { id: 'student1', name: 'Student A' } }],
          schedules: [
            {
              attendances: [
                { userId: 'tutor1', status: 'masuk' },
                { userId: 'student1', status: 'masuk' },
              ],
            },
          ],
        },
      ]);

      const result = await AttendanceService.getAttendanceStatistics();

      expect(mockPrisma.prisma.class.findMany).toHaveBeenCalledWith({
        where: { status: 'selesai' },
        include: {
          tutor: true,
          studentClasses: { include: { user: true } },
          schedules: { include: { attendances: true } },
        },
      });
      expect(result).toEqual([
        {
          classId: 'class1',
          classCode: 'CLS1',
          tutorStats: {
            name: 'Tutor A',
            masuk: 1,
            izin: 0,
            alpha: 0,
          },
          studentStats: [
            {
              name: 'Student A',
              masuk: 1,
              izin: 0,
              alpha: 0,
            },
          ],
        },
      ]);
    });
  });

  describe('getMyAttendanceStatistics', () => {
    it('should return attendance statistics for a tutor', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          id: 'class1',
          code: 'CLS1',
          order: {
            bimbelPackage: { name: 'Math Package', level: 'SMA' },
            groupType: { price: 100000 },
          },
          schedules: [
            {
              attendances: [{ userId: 'tutor1', status: 'masuk' }],
            },
          ],
        },
      ]);
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid' });

      const result = await AttendanceService.getMyAttendanceStatistics({
        id: 'tutor1',
        role: 'tutor',
      });

      expect(mockPrisma.prisma.class.findMany).toHaveBeenCalledWith({
        where: { tutorId: 'tutor1', status: 'selesai' },
        include: {
          schedules: { include: { attendances: true } },
          order: {
            include: {
              groupType: { select: { price: true } },
              bimbelPackage: { select: { name: true, level: true } },
            },
          },
        },
      });
      expect(result).toEqual([
        {
          classId: 'class1',
          classCode: 'CLS1',
          bimbelPackage: { name: 'Math Package', level: 'SMA' },
          tutorStats: expect.objectContaining({
            tutorId: 'tutor1',
            name: undefined,
            masuk: 1,
            izin: 0,
            alpha: 0,
            totalSchedules: 1,
            scheduleProgress: 100,
            totalAttendance: 100,
            salary: 90000,
            payroll: 90000,
            status: 'paid',
          }),
        },
      ]);
    });
  });
  it('should return attendance statistics for a siswa (student)', async () => {
    mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
    {
      class: {
      id: 'class1',
      code: 'CLS1',
      schedules: [
        {
        attendances: [
          { userId: 'student1', status: 'masuk' },
          { userId: 'tutor1', status: 'masuk' },
        ],
        },
        {
        attendances: [
          { userId: 'student1', status: 'izin' },
          { userId: 'tutor1', status: 'masuk' },
        ],
        },
        {
        attendances: [
          { userId: 'tutor1', status: 'masuk' },
        ],
        },
      ],
      tutor: { id: 'tutor1', name: 'Tutor A' },
      order: {
        bimbelPackage: { name: 'Math Package', level: 'SMA' },
      },
      },
    },
    ]);

    const result = await AttendanceService.getMyAttendanceStatistics({
    id: 'student1',
    role: 'siswa',
    });

    expect(mockPrisma.prisma.studentClass.findMany).toHaveBeenCalledWith({
    where: {
      userId: 'student1',
      class: { status: 'selesai' },
    },
    include: {
      class: {
      include: {
        schedules: { include: { attendances: true } },
        tutor: true,
        order: {
        include: {
          bimbelPackage: { select: { name: true, level: true } },
        },
        },
      },
      },
    },
    });

    expect(result).toEqual([
    {
      classId: 'class1',
      classCode: 'CLS1',
      bimbelPackage: { name: 'Math Package', level: 'SMA' },
      tutorStats: {
      masuk: 3,
      izin: 0,
      alpha: 0,
      tutorId: 'tutor1',
      name: 'Tutor A',
      },
      studentStats: {
      masuk: 1,
      izin: 1,
      alpha: 0,
      totalSchedules: 3,
      scheduleProgress: 66.66666666666666,
      totalAttendance: 33.33333333333333,
      },
    },
    ]);
  });

  it('should throw error for unsupported role in getMyAttendanceStatistics', async () => {
    await expect(
    AttendanceService.getMyAttendanceStatistics({ id: 'admin1', role: 'admin' })
    ).rejects.toThrow('Role not supported for this operation');
  });

  describe('getRekapKelasById', () => {
    it('should return rekap data for a class', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 'class1',
        code: 'CLS1',
        tutor: { id: 'tutor1', name: 'Tutor A' },
        schedules: [
          {
            attendances: [{ userId: 'tutor1', status: 'masuk' }],
          },
        ],
        order: {
          bimbelPackage: { name: 'Math Package', level: 'SMA' },
        },
        studentClasses: [
          { user: { id: 'student1', name: 'Student A' } },
        ],
      });

      const result = await AttendanceService.getRekapKelasById('class1');

      expect(mockPrisma.prisma.class.findUnique).toHaveBeenCalledWith({
        where: { id: 'class1' },
        include: {
          schedules: { include: { attendances: true } },
          tutor: true,
          order: {
            include: {
              bimbelPackage: {
                select: {
                  name: true,
                  level: true,
                },
              },
            },
          },
          studentClasses: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(expect.objectContaining({
        name: 'Math Package',
        level: 'SMA',
        classCode: 'CLS1',
        tutorName: 'Tutor A',
        tutorMasuk: 1,
        tutorIzin: 0,
        tutorAlpha: 0,
        students: [{ name: 'Student A', hadir: 0, izin: 0, absen: 0 }],
        pertemuan: 1,
        kosong: 0,
        progress: 100,
        absensi: 100,
      }));
    });
  });
  describe('createIzinNotification', () => {
    it('should create izin notifications for all students when tutor does izin', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          order: { bimbelPackage: { name: 'Math Package', level: 'SMA' } },
          tutor: { id: 'tutor1', name: 'Tutor A', tutors: [{ photo: 'photo-url' }] },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student A' } },
            { user: { id: 'student2', name: 'Student B' } },
          ],
        },
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1', name: 'Tutor A' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});

      await AttendanceService.createIzinNotification({
        scheduleId: 'schedule1',
        userId: 'tutor1',
        reason: 'Sakit',
      });

      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'student1',
          type: 'Izin',
          description: '<strong>Tutor A</strong> (tutor) melakukan izin pada <strong>Math Package SMA #CLS1</strong>',
          reason: 'Sakit',
          photo: 'photo-url',
        },
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'student2',
          type: 'Izin',
          description: '<strong>Tutor A</strong> (tutor) melakukan izin pada <strong>Math Package SMA #CLS1</strong>',
          reason: 'Sakit',
          photo: 'photo-url',
        },
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledTimes(2);
    });

    it('should create izin notification for tutor when user is a student', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          order: { bimbelPackage: { name: 'Math Package', level: 'SMA' } },
          tutor: { id: 'tutor1', name: 'Tutor A', tutors: [{ photo: 'photo-url' }] },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student A' } },
          ],
        },
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'student1', name: 'Student A' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});

      await AttendanceService.createIzinNotification({
        scheduleId: 'schedule1',
        userId: 'student1',
        reason: 'Izin keluarga',
      });

      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'tutor1',
          type: 'Izin',
          description: '<strong>Student A</strong> melakukan izin pada <strong>Math Package SMA #CLS1</strong>',
          reason: 'Izin keluarga',
          photo: 'photo-url',
        },
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledTimes(1);
    });

    it('should handle missing tutor.tutors array gracefully', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          order: { bimbelPackage: { name: 'Math Package', level: 'SMA' } },
          tutor: { id: 'tutor1', name: 'Tutor A', tutors: [] },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student A' } },
          ],
        },
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'student1', name: 'Student A' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});

      await AttendanceService.createIzinNotification({
        scheduleId: 'schedule1',
        userId: 'student1',
        reason: 'Izin keluarga',
      });

      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          photo: null,
        }),
      });
    });

    it('should not create any notification if there is no tutor', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          order: { bimbelPackage: { name: 'Math Package', level: 'SMA' } },
          tutor: null,
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student A' } },
          ],
        },
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'student1', name: 'Student A' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});

      await AttendanceService.createIzinNotification({
        scheduleId: 'schedule1',
        userId: 'student1',
        reason: 'Izin keluarga',
      });

      expect(mockPrisma.prisma.notification.create).not.toHaveBeenCalled();
    });
  });
  describe('createMasukNotification', () => {
    it('should create notifications for tutor and user when user is a student', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          order: { bimbelPackage: { name: 'Math Package', level: 'SMA' } },
          tutor: { id: 'tutor1', name: 'Tutor A', tutors: [{ photo: 'photo-url' }] },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student A' } },
            { user: { id: 'student2', name: 'Student B' } },
          ],
        },
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'student1', name: 'Student A' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});

      await AttendanceService.createMasukNotification({
        scheduleId: 'schedule1',
        userId: 'student1',
      });

      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'tutor1',
          type: 'Absensi',
          description: '<strong>Student A</strong> melakukan absen masuk pada <strong>Math Package SMA #CLS1</strong>',
          photo: 'photo-url',
        },
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'student1',
          type: 'Absensi',
          description: '<strong>Anda</strong> melakukan absen masuk pada <strong>Math Package SMA #CLS1</strong>',
          photo: 'photo-url',
        },
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledTimes(2);
    });

    it('should create notifications for all students and tutor when user is the tutor', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          order: { bimbelPackage: { name: 'Math Package', level: 'SMA' } },
          tutor: { id: 'tutor1', name: 'Tutor A', tutors: [{ photo: 'photo-url' }] },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student A' } },
            { user: { id: 'student2', name: 'Student B' } },
          ],
        },
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1', name: 'Tutor A' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});

      await AttendanceService.createMasukNotification({
        scheduleId: 'schedule1',
        userId: 'tutor1',
      });

      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'student1',
          type: 'Absensi',
          description: '<strong>Tutor A</strong> (tutor) memulai pembelajaran <strong>Math Package SMA #CLS1</strong>',
          photo: 'photo-url',
        },
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'student2',
          type: 'Absensi',
          description: '<strong>Tutor A</strong> (tutor) memulai pembelajaran <strong>Math Package SMA #CLS1</strong>',
          photo: 'photo-url',
        },
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'tutor1',
          type: 'Absensi',
          description: '<strong>Anda</strong> melakukan absen masuk pada <strong>Math Package SMA #CLS1</strong>',
          photo: 'photo-url',
        },
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledTimes(3);
    });

    it('should handle missing tutor.tutors array gracefully', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          order: { bimbelPackage: { name: 'Math Package', level: 'SMA' } },
          tutor: { id: 'tutor1', name: 'Tutor A', tutors: [] },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student A' } },
          ],
        },
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'student1', name: 'Student A' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});

      await AttendanceService.createMasukNotification({
        scheduleId: 'schedule1',
        userId: 'student1',
      });

      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          photo: null,
        }),
      });
    });
  });
  
  
});