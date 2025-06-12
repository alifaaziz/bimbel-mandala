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
});