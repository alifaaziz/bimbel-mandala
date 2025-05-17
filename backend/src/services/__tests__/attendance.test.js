import { jest } from '@jest/globals';

const mockPrisma = {
  attendance: { create: jest.fn() },
  schedule: { findUnique: jest.fn(), findMany: jest.fn() },
  class: { findMany: jest.fn(), findUnique: jest.fn() },
  studentClass: { findMany: jest.fn() },
  salary: { findFirst: jest.fn() }
};

const mockSalaryService = {
  createSalary: jest.fn()
};

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: mockPrisma
}));
jest.unstable_mockModule('../salary.js', () => ({
  SalaryService: mockSalaryService
}));

const { AttendanceService } = await import('../attendance.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AttendanceService', () => {
  describe('createAttendance', () => {
    it('should create attendance and not create salary if not last schedule', async () => {
      mockPrisma.attendance.create.mockResolvedValueOnce({ id: 1 });
      mockPrisma.schedule.findUnique.mockResolvedValueOnce({
        id: 10,
        meet: 1,
        class: {
          tutor: { id: 'tutor1' },
          order: { id: 'order1', groupType: { price: 10000 } },
          schedules: [{ meet: 1, attendances: [] }, { meet: 2, attendances: [] }]
        }
      });
      const result = await AttendanceService.createAttendance({
        scheduleId: 10, userId: 'tutor1', status: 'masuk'
      });
      expect(result).toEqual({ id: 1 });
      expect(mockSalaryService.createSalary).not.toHaveBeenCalled();
    });

    it('should create salary if last schedule and tutor', async () => {
      mockPrisma.attendance.create.mockResolvedValueOnce({ id: 2 });
      mockPrisma.schedule.findUnique.mockResolvedValueOnce({
        id: 20,
        meet: 2,
        class: {
          tutor: { id: 'tutor2' },
          order: { id: 'order2', groupType: { price: 20000 } },
          schedules: [
            { meet: 1, attendances: [{ userId: 'tutor2', status: 'masuk' }] },
            { meet: 2, attendances: [{ userId: 'tutor2', status: 'masuk' }] }
          ]
        }
      });
      const result = await AttendanceService.createAttendance({
        scheduleId: 20, userId: 'tutor2', status: 'masuk'
      });
      expect(result).toEqual({ id: 2 });
      expect(mockSalaryService.createSalary).toHaveBeenCalledWith({
        tutorId: 'tutor2',
        orderId: 'order2',
        totalSalary: expect.any(Number)
      });
    });
  });

  describe('markAlphaForMissedSchedules', () => {
    it('should create alpha attendance for students and tutor', async () => {
      mockPrisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 1,
          class: {
            studentClasses: [
              { user: { id: 'student1' } },
              { user: { id: 'student2' } }
            ],
            tutor: { id: 'tutor1' },
            tutorId: 'tutor1'
          }
        }
      ]);
      await AttendanceService.markAlphaForMissedSchedules();
      expect(mockPrisma.attendance.create).toHaveBeenCalledWith({
        data: { scheduleId: 1, userId: 'student1', status: 'alpha', reason: null }
      });
      expect(mockPrisma.attendance.create).toHaveBeenCalledWith({
        data: { scheduleId: 1, userId: 'student2', status: 'alpha', reason: null }
      });
      expect(mockPrisma.attendance.create).toHaveBeenCalledWith({
        data: { scheduleId: 1, userId: 'tutor1', status: 'alpha', reason: null }
      });
    });

    it('should create alpha attendance only for tutor if no students', async () => {
      mockPrisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 99,
          class: {
            studentClasses: [],
            tutor: { id: 'tutorX' },
            tutorId: 'tutorX'
          }
        }
      ]);
      await AttendanceService.markAlphaForMissedSchedules();
      expect(mockPrisma.attendance.create).toHaveBeenCalledWith({
        data: { scheduleId: 99, userId: 'tutorX', status: 'alpha', reason: null }
      });
    });
  });

  describe('getAttendanceStatistics', () => {
    it('should return attendance stats for classes', async () => {
      mockPrisma.class.findMany.mockResolvedValueOnce([
        {
          id: 1,
          code: 'CLS1',
          tutor: { id: 'tutor1', name: 'Tutor' },
          studentClasses: [
            { user: { id: 'student1', name: 'Student 1' } }
          ],
          schedules: [
            { attendances: [{ userId: 'tutor1', status: 'masuk' }, { userId: 'student1', status: 'izin' }] }
          ]
        }
      ]);
      const result = await AttendanceService.getAttendanceStatistics();
      expect(result[0]).toMatchObject({
        classId: 1,
        classCode: 'CLS1',
        tutorStats: expect.objectContaining({ name: 'Tutor', masuk: 1 }),
        studentStats: [expect.objectContaining({ name: 'Student 1', izin: 1 })]
      });
    });
  });

  describe('getMyAttendanceStatistics', () => {
    it('should return tutor stats', async () => {
      mockPrisma.class.findMany.mockResolvedValueOnce([
        {
          id: 1,
          code: 'CLS1',
          schedules: [
            { attendances: [{ userId: 'tutor1', status: 'masuk' }] }
          ],
          order: {
            groupType: { price: 10000 },
            bimbelPackage: { name: 'Paket', level: 'SMA' }
          }
        }
      ]);
      mockPrisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid' });
      const result = await AttendanceService.getMyAttendanceStatistics({ id: 'tutor1', role: 'tutor', name: 'Tutor' });
      expect(result[0]).toHaveProperty('tutorStats.status', 'paid');
    });

    it('should return student stats', async () => {
      mockPrisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            id: 2,
            code: 'CLS2',
            schedules: [
              { attendances: [{ userId: 'student1', status: 'masuk' }] }
            ],
            tutor: { id: 'tutor2', name: 'Tutor 2' },
            order: {
              bimbelPackage: { name: 'Paket', level: 'SMA' }
            }
          }
        }
      ]);
      const result = await AttendanceService.getMyAttendanceStatistics({ id: 'student1', role: 'siswa', name: 'Student 1' });
      expect(result[0]).toHaveProperty('studentStats.masuk', 1);
      expect(result[0]).toHaveProperty('tutorStats.name', 'Tutor 2');
    });

    it('should throw if role not supported', async () => {
      await expect(AttendanceService.getMyAttendanceStatistics({ id: 'x', role: 'admin' }))
        .rejects.toThrow('Role not supported for this operation');
    });

    it('should return all fields with default values if no tutor and no bimbelPackage (siswa)', async () => {
      mockPrisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            id: 3,
            code: 'CLS3',
            schedules: [],
            tutor: null,
            order: { bimbelPackage: null }
          }
        }
      ]);
      const result = await AttendanceService.getMyAttendanceStatistics({
        id: 'student3',
        role: 'siswa',
        name: 'Student 3'
      });
      expect(result[0]).toEqual({
        classId: 3,
        classCode: 'CLS3',
        bimbelPackage: {
          name: null,
          level: null
        },
        tutorStats: null,
        studentStats: {
          masuk: 0,
          izin: 0,
          alpha: 0,
          totalSchedules: 0,
          scheduleProgress: 0,
          totalAttendance: 0
        }
      });
    });

    it('should return all fields with tutorStats if tutor exists (siswa)', async () => {
      mockPrisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            id: 4,
            code: 'CLS4',
            schedules: [
              { attendances: [{ userId: 'student4', status: 'masuk' }, { userId: 'tutor4', status: 'masuk' }] }
            ],
            tutor: { id: 'tutor4', name: 'Tutor 4' },
            order: { bimbelPackage: { name: 'Paket', level: 'SMA' } }
          }
        }
      ]);
      const result = await AttendanceService.getMyAttendanceStatistics({
        id: 'student4',
        role: 'siswa',
        name: 'Student 4'
      });
      expect(result[0]).toEqual({
        classId: 4,
        classCode: 'CLS4',
        bimbelPackage: {
          name: 'Paket',
          level: 'SMA'
        },
        tutorStats: {
          masuk: 1,
          izin: 0,
          alpha: 0,
          tutorId: 'tutor4',
          name: 'Tutor 4'
        },
        studentStats: {
          masuk: 1,
          izin: 0,
          alpha: 0,
          totalSchedules: 1,
          scheduleProgress: 100,
          totalAttendance: 100
        }
      });
    });

    it('should return all fields with default tutorStats if no tutor (siswa)', async () => {
      mockPrisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            id: 5,
            code: 'CLS5',
            schedules: [],
            tutor: null,
            order: { bimbelPackage: null }
          }
        }
      ]);
      const result = await AttendanceService.getMyAttendanceStatistics({
        id: 'student5',
        role: 'siswa',
        name: 'Student 5'
      });
      expect(result[0]).toEqual({
        classId: 5,
        classCode: 'CLS5',
        bimbelPackage: {
          name: null,
          level: null
        },
        tutorStats: null,
        studentStats: {
          masuk: 0,
          izin: 0,
          alpha: 0,
          totalSchedules: 0,
          scheduleProgress: 0,
          totalAttendance: 0
        }
      });
    });

    it('should return bimbelPackage name and level as null if order or bimbelPackage is null (siswa)', async () => {
      // order null
      mockPrisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            id: 6,
            code: 'CLS6',
            schedules: [],
            tutor: null,
            order: null
          }
        }
      ]);
      let result = await AttendanceService.getMyAttendanceStatistics({
        id: 'student6',
        role: 'siswa',
        name: 'Student 6'
      });
      expect(result[0]).toMatchObject({
        classId: 6,
        classCode: 'CLS6',
        bimbelPackage: {
          name: null,
          level: null
        }
      });

      // order ada, bimbelPackage null
      mockPrisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            id: 7,
            code: 'CLS7',
            schedules: [],
            tutor: null,
            order: { bimbelPackage: null }
          }
        }
      ]);
      result = await AttendanceService.getMyAttendanceStatistics({
        id: 'student7',
        role: 'siswa',
        name: 'Student 7'
      });
      expect(result[0]).toMatchObject({
        classId: 7,
        classCode: 'CLS7',
        bimbelPackage: {
          name: null,
          level: null
        }
      });
    });

    it('should return all fields with correct values if all data exists (siswa)', async () => {
      mockPrisma.studentClass.findMany.mockResolvedValueOnce([
        {
          class: {
            id: 10,
            code: 'CLS10',
            schedules: [
              { attendances: [
                { userId: 'student10', status: 'masuk' },
                { userId: 'tutor10', status: 'masuk' }
              ]}
            ],
            tutor: { id: 'tutor10', name: 'Tutor 10' },
            order: { bimbelPackage: { name: 'Paket X', level: 'SMA' } }
          }
        }
      ]);
      const result = await AttendanceService.getMyAttendanceStatistics({
        id: 'student10',
        role: 'siswa',
        name: 'Student 10'
      });
      expect(result[0]).toEqual({
        classId: 10,
        classCode: 'CLS10',
        bimbelPackage: {
          name: 'Paket X',
          level: 'SMA'
        },
        tutorStats: {
          masuk: 1,
          izin: 0,
          alpha: 0,
          tutorId: 'tutor10',
          name: 'Tutor 10'
        },
        studentStats: {
          masuk: 1,
          izin: 0,
          alpha: 0,
          totalSchedules: 1,
          scheduleProgress: 100,
          totalAttendance: 100
        }
      });
    });
  });

  describe('getRekapKelasById', () => {
    it('should return rekap data for class with tutor and bimbelPackage', async () => {
      mockPrisma.class.findUnique.mockResolvedValueOnce({
        id: 1,
        code: 'CLS1',
        schedules: [
          { attendances: [{ userId: 'tutor1', status: 'masuk' }, { userId: 'student1', status: 'izin' }] }
        ],
        tutor: { id: 'tutor1', name: 'Tutor' },
        order: { bimbelPackage: { name: 'Paket', level: 'SMA' } },
        studentClasses: [
          { user: { id: 'student1', name: 'Student 1' } }
        ]
      });
      const result = await AttendanceService.getRekapKelasById(1);
      expect(result).toEqual({
        name: 'Paket',
        level: 'SMA',
        classCode: 'CLS1',
        tutorName: 'Tutor',
        tutorMasuk: 1,
        tutorIzin: 0,
        tutorAlpha: 0,
        students: [expect.objectContaining({ name: 'Student 1', izin: 1 })],
        pertemuan: 1,
        kosong: 0,
        progress: 100,
        absensi: 100
      });
    });

    it('should return all fields with default values if no tutor and no bimbelPackage', async () => {
      mockPrisma.class.findUnique.mockResolvedValueOnce({
        id: 2,
        code: 'CLS2',
        schedules: [],
        tutor: null,
        order: { bimbelPackage: null },
        studentClasses: []
      });
      const result = await AttendanceService.getRekapKelasById(2);
      expect(result).toEqual({
        name: '',
        level: '',
        classCode: 'CLS2',
        tutorName: '',
        tutorMasuk: 0,
        tutorIzin: 0,
        tutorAlpha: 0,
        students: [],
        pertemuan: 0,
        kosong: 0,
        progress: 0,
        absensi: 0
      });
    });

    it('should throw if class not found', async () => {
      mockPrisma.class.findUnique.mockResolvedValueOnce(null);
      await expect(AttendanceService.getRekapKelasById(999)).rejects.toThrow('Kelas tidak ditemukan');
    });
  });
});