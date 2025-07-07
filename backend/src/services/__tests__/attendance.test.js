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

    it('should create attendance for siswa masuk even if class.tutor is missing', async () => {
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce(null); // No existing attendance for the user
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'user1', role: 'siswa' });
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule1',
        date: new Date().toISOString(),
        class: { tutor: null }, // tutorId tidak ada
      });
      mockPrisma.prisma.attendance.create.mockResolvedValueOnce({ id: 'attendance1' });

      const result = await AttendanceService.createAttendance({
        scheduleId: 'schedule1',
        userId: 'user1',
        status: 'masuk',
      });

      expect(mockPrisma.prisma.attendance.create).toHaveBeenCalledWith({
        data: { scheduleId: 'schedule1', userId: 'user1', status: 'masuk', reason: null },
      });
      expect(result).toEqual({ id: 'attendance1' });
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
      mockPrisma.prisma.attendance.create.mockResolvedValue({});

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
        expect.objectContaining({
          classId: 'class1',
          classCode: 'CLS1',
          bimbelPackage: { name: 'Math Package', level: 'SMA' },
          tutorStats: expect.objectContaining({
            tutorId: 'tutor1',
            masuk: 1,
            salary: 90000,
            payroll: 90000,
            status: 'paid',
          }),
        }),
      ]);
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
        expect.objectContaining({
          classId: 'class1',
          classCode: 'CLS1',
          bimbelPackage: { name: 'Math Package', level: 'SMA' },
          tutorStats: expect.objectContaining({
            tutorId: 'tutor1',
            name: 'Tutor A',
          }),
          studentStats: expect.objectContaining({
            masuk: 1,
            izin: 1,
            alpha: 0,
            totalSchedules: 3,
          }),
        }),
      ]);
    });

    it('should throw error for unsupported role in getMyAttendanceStatistics', async () => {
      await expect(
        AttendanceService.getMyAttendanceStatistics({ id: 'admin1', role: 'admin' })
      ).rejects.toThrow('Role not supported for this operation');
    });

    it('should set bimbelPackage name and level to null if order.bimbelPackage is null', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          id: 'class2',
          code: 'CLS2',
          order: {
            bimbelPackage: null,
            groupType: { price: 100000 },
          },
          schedules: [],
        },
      ]);
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid' });

      const result = await AttendanceService.getMyAttendanceStatistics({
        id: 'tutor2',
        role: 'tutor',
      });

      expect(result[0].bimbelPackage).toEqual({ name: null, level: null });
    });

    it('should set bimbelPackage name and level to null if order is null', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          id: 'class3',
          code: 'CLS3',
          order: null,
          schedules: [],
        },
      ]);
      // salary.findFirst tidak dipanggil karena order null

      const result = await AttendanceService.getMyAttendanceStatistics({
        id: 'tutor3',
        role: 'tutor',
      });

      expect(result[0].bimbelPackage).toEqual({ name: null, level: null });
    });

    it('should set scheduleProgress and totalAttendance to 0 if there are no schedules', async () => {
      mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            id: 'classEmpty',
            code: 'CLS-EMPTY',
            schedules: [], // Tidak ada jadwal
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

      expect(result[0].studentStats.totalSchedules).toBe(0);
      expect(result[0].studentStats.scheduleProgress).toBe(0);
      expect(result[0].studentStats.totalAttendance).toBe(0);
    });

    it('should set tutorStats to null if classData.tutor is missing in getRekapKelasById', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 'classNoTutor',
        code: 'CLS-NOTUTOR',
        tutor: null, // tutor tidak ada
        schedules: [
          {
            attendances: [
              { userId: 'student1', status: 'masuk' },
            ],
          },
        ],
        order: {
          bimbelPackage: { name: 'Math Package', level: 'SMA' },
        },
        studentClasses: [
          { user: { id: 'student1', name: 'Student A' } },
        ],
      });

      const result = await AttendanceService.getRekapKelasById('classNoTutor');

      expect(result.tutorStats).toBeNull();
    });
    it('should set tutorStats to null if tutor is missing (student)', async () => {
      mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            id: 'classNoTutor',
            code: 'CLS-NOTUTOR',
            schedules: [
              {
                attendances: [
                  { userId: 'student1', status: 'masuk' },
                ],
              },
            ],
            tutor: null, // tutor tidak ada
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

      expect(result[0].tutorStats).toBeNull();
    });
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
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid' });

      const result = await AttendanceService.getRekapKelasById('class1');

      expect(mockPrisma.prisma.class.findUnique).toHaveBeenCalledWith({
        where: { id: 'class1' },
        include: {
          schedules: { include: { attendances: true } },
          tutor: true,
          order: {
            include: {
              groupType: { select: { price: true } },
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
        tutorStats: expect.any(Object),
        students: [{ name: 'Student A', hadir: 0, izin: 0, absen: 0 }],
        pertemuan: expect.any(Number),
        kosong: expect.any(Number),
        progress: expect.any(Number),
        absensi: expect.any(Number),
      }));
    });

    it('should throw error if class not found', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce(null);
      await expect(AttendanceService.getRekapKelasById('notfound')).rejects.toThrow('Kelas tidak ditemukan');
    });

    it('should set progress and absensi to 0 if tutorStats is missing', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 'class1',
        code: 'CLS1',
        tutor: { id: 'tutor1', name: 'Tutor A' },
        schedules: [],
        order: {
          bimbelPackage: { name: 'Math Package', level: 'SMA' },
        },
        studentClasses: [
          { user: { id: 'student1', name: 'Student A' } },
        ],
      });
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid' });

      const result = await AttendanceService.getRekapKelasById('class1');

      expect(result.progress).toBe(0);
      expect(result.absensi).toBe(0);
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