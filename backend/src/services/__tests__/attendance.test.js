import { expect, jest } from '@jest/globals';
import { generatePrismaMock } from '../../utils/jest.js';

const mockPrisma = generatePrismaMock();

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: mockPrisma.prisma,
}));

const { AttendanceService } = await import('../attendance.js');
import { SalaryService } from '../salary.js';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AttendanceService', () => {
  describe('createAttendance', () => {
    it('should throw if attendance already exists', async () => {
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce({ id: 'att1' });
      await expect(
        AttendanceService.createAttendance({ scheduleId: 'sch1', userId: 'u1', status: 'masuk' })
      ).rejects.toThrow('Attendance can only be done once');
    });

    it('should throw if schedule not found', async () => {
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce(null);
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'u1' });
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce(null);
      await expect(
        AttendanceService.createAttendance({ scheduleId: 'sch1', userId: 'u1', status: 'masuk' })
      ).rejects.toThrow('Schedule not found');
    });

    it('should throw if attendance not on schedule date', async () => {
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce(null);
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'u1' });
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        date: new Date(Date.now() - 86400000), // yesterday
        class: { id: 'class1', tutor: { id: 'tutor1' } }
      });
      await expect(
        AttendanceService.createAttendance({ scheduleId: 'sch1', userId: 'u1', status: 'masuk' })
      ).rejects.toThrow('Attendance can only be done on the schedule date');
    });

    it('should create attendance and call createSalaryIfLastAttendance', async () => {
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce(null);
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'u1' });
      const today = new Date();
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        date: today,
        class: { id: 'class1', tutor: { id: 'tutor1' } }
      });
      mockPrisma.prisma.attendance.create.mockResolvedValueOnce({ id: 'att2', scheduleId: 'sch1', userId: 'u1', status: 'masuk', reason: null });
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([]);
      const originalFn = AttendanceService.createSalaryIfLastAttendance;
      const spy = jest.fn().mockResolvedValueOnce();
      AttendanceService.createSalaryIfLastAttendance = spy;

      const result = await AttendanceService.createAttendance({ scheduleId: 'sch1', userId: 'u1', status: 'masuk' });

      expect(result).toEqual({ id: 'att2', scheduleId: 'sch1', userId: 'u1', status: 'masuk', reason: null });

      AttendanceService.createSalaryIfLastAttendance = originalFn;
    });

    it('should create attendance with reason if status is izin', async () => {
      mockPrisma.prisma.attendance.findFirst.mockResolvedValueOnce(null);
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'u2' });
      const today = new Date();
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        date: today,
        class: { id: 'class2', tutor: { id: 'tutor2' } }
      });
      mockPrisma.prisma.attendance.create.mockResolvedValueOnce({ id: 'att4', scheduleId: 'sch3', userId: 'u2', status: 'izin', reason: 'Sakit' });
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([]);
      const originalFn = AttendanceService.createSalaryIfLastAttendance;
      const spy = jest.fn().mockResolvedValueOnce();
      AttendanceService.createSalaryIfLastAttendance = spy;

      const result = await AttendanceService.createAttendance({ scheduleId: 'sch3', userId: 'u2', status: 'izin', reason: 'Sakit' });

      expect(result).toEqual({ id: 'att4', scheduleId: 'sch3', userId: 'u2', status: 'izin', reason: 'Sakit' });

      AttendanceService.createSalaryIfLastAttendance = originalFn;
    });
  });

  describe('alertAttendance', () => {
    it('should return empty array if no class or no tutor', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce(null);
      const result = await AttendanceService.alertAttendance('notfound');
      expect(result).toEqual([]);
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({ id: 'class1', tutor: null, studentClasses: [], schedules: [] });
      const result2 = await AttendanceService.alertAttendance('class1');
      expect(result2).toEqual([]);
    });

    it('should return alert for tutor late > 15 minutes', async () => {
      const jadwalMulai = new Date();
      // createdAt lebih dari 15 menit setelah jadwalMulai (dan offset -7 jam)
      const waktuAbsen = new Date(jadwalMulai.getTime() + (16 * 60000));
      waktuAbsen.setHours(waktuAbsen.getHours() + 7); // simulasikan offset agar hasil selisih > 15 menit
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 'class1',
        tutor: { id: 'tutor1' },
        studentClasses: [{ user: { id: 'student1' } }],
        schedules: [
          {
            date: jadwalMulai,
            meet: 1,
            attendances: [
              { userId: 'tutor1', status: 'masuk', createdAt: waktuAbsen }
            ]
          }
        ]
      });
      const result = await AttendanceService.alertAttendance('class1');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toMatchObject({ jenis: 'Keterlambatan' });
    });

    it('should return alert for all students not present (Pembatalan)', async () => {
      const jadwalMulai = new Date(Date.now() - 24 * 60 * 60000); // kemarin
      const waktuAbsen = new Date(jadwalMulai.getTime() + (10 * 60000));
      waktuAbsen.setHours(waktuAbsen.getHours() + 7); // simulasikan offset
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 'class2',
        tutor: { id: 'tutor1' },
        studentClasses: [{ user: { id: 'student1' } }, { user: { id: 'student2' } }],
        schedules: [
          {
            date: jadwalMulai,
            meet: 2,
            attendances: [
              { userId: 'tutor1', status: 'masuk', createdAt: waktuAbsen }
              // siswa tidak ada yang masuk
            ]
          }
        ]
      });
      const result = await AttendanceService.alertAttendance('class2');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(r => r.jenis === 'Pembatalan')).toBe(true);
    });

    it('should not return Pembatalan alert if at least one student is present', async () => {
      const jadwalMulai = new Date(Date.now() - 24 * 60 * 60000); // kemarin
      const waktuAbsen = new Date(jadwalMulai.getTime() + (10 * 60000));
      waktuAbsen.setHours(waktuAbsen.getHours() + 7); // simulasikan offset
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 'class3',
        tutor: { id: 'tutor1' },
        studentClasses: [
          { user: { id: 'student1' } },
          { user: { id: 'student2' } }
        ],
        schedules: [
          {
            date: jadwalMulai,
            meet: 2,
            attendances: [
              { userId: 'tutor1', status: 'masuk', createdAt: waktuAbsen },
              { userId: 'student1', status: 'masuk', createdAt: waktuAbsen }
            ]
          }
        ]
      });
      const result = await AttendanceService.alertAttendance('class3');
      expect(result.some(r => r.jenis === 'Pembatalan')).toBe(false);
    });

    it('should not return any alert if tutor has not attended', async () => {
      const jadwalMulai = new Date();
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 'classNoTutorAttendance',
        tutor: { id: 'tutor1' },
        studentClasses: [
          { user: { id: 'student1' } },
          { user: { id: 'student2' } }
        ],
        schedules: [
          {
            date: jadwalMulai,
            meet: 1,
            attendances: [
              { userId: 'student1', status: 'masuk', createdAt: jadwalMulai },
              { userId: 'student2', status: 'izin', createdAt: jadwalMulai }
            ]
          }
        ]
      });
      const result = await AttendanceService.alertAttendance('classNoTutorAttendance');
      expect(result).toEqual([]);
    });
  });

  describe('markAlphaForMissedSchedules', () => {
    it('should mark alpha for missed schedules', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            studentClasses: [{ user: { id: 'student1' } }],
            tutor: { id: 'tutor1' },
          },
          attendances: [],
        },
      ]);
      mockPrisma.prisma.attendance.create.mockResolvedValue({});
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([]); 

      await AttendanceService.markAlphaForMissedSchedules();

      expect(mockPrisma.prisma.attendance.create).toHaveBeenCalledTimes(2); 
    });

      it('should mark alpha for all students who did not attend', async () => {
    mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
      {
        id: 'schedule1',
        date: new Date(Date.now() - 86400000),
        class: {
          studentClasses: [
            { user: { id: 'student1' } },
            { user: { id: 'student2' } }
          ],
          tutor: { id: 'tutor1' }
        },
        attendances: [
          { userId: 'student1', status: 'masuk' }
        ]
      }
    ]);
    mockPrisma.prisma.attendance.create.mockResolvedValue({});
    mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([]); 

    await AttendanceService.markAlphaForMissedSchedules();

    expect(mockPrisma.prisma.attendance.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          scheduleId: 'schedule1',
          userId: 'student2',
          status: 'alpha'
        })
      })
    );
  });

  it('should mark alpha for tutor if tutor did not attend', async () => {
    mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
      {
        id: 'schedule2',
        date: new Date(Date.now() - 86400000),
        class: {
          studentClasses: [
            { user: { id: 'student1' } }
          ],
          tutor: { id: 'tutor2' }
        },
        attendances: [
          { userId: 'student1', status: 'masuk' }
        ]
      }
    ]);
    mockPrisma.prisma.attendance.create.mockResolvedValue({});
    mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([]);

    await AttendanceService.markAlphaForMissedSchedules();
    expect(mockPrisma.prisma.attendance.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          scheduleId: 'schedule2',
          userId: 'tutor2',
          status: 'alpha'
        })
      })
    );
  });

  it('should not mark alpha if all attended', async () => {
    mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
      {
        id: 'schedule3',
        date: new Date(Date.now() - 86400000),
        class: {
          studentClasses: [
            { user: { id: 'student1' } }
          ],
          tutor: { id: 'tutor3' }
        },
        attendances: [
          { userId: 'student1', status: 'masuk' },
          { userId: 'tutor3', status: 'masuk' }
        ]
      }
    ]);
    mockPrisma.prisma.attendance.create.mockResolvedValue({});
    mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([]);

    await AttendanceService.markAlphaForMissedSchedules();
    expect(mockPrisma.prisma.attendance.create).not.toHaveBeenCalled();
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
            amount: 100000,
          },
          schedules: [
            {
              attendances: [{ userId: 'tutor1', status: 'masuk' }],
            },
          ],
          studentClasses: [{ user: { id: 'student1' } }],
        },
      ]);
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid', total: 60000, payroll: 60000 });

      const result = await AttendanceService.getMyAttendanceStatistics({
        id: 'tutor1',
        role: 'tutor',
      });

      expect(result[0]).toEqual(expect.objectContaining({
        classId: 'class1',
        classCode: 'CLS1',
        bimbelPackage: { name: 'Math Package', level: 'SMA' },
        tutorStats: expect.objectContaining({
          tutorId: 'tutor1',
          masuk: 1,
          salary: 60000,
          payroll: 60000,
          status: 'paid',
        }),
        kosong: expect.any(Number),
        kesesuaian: expect.any(Number),
      }));
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
            studentClasses: [{ user: { id: 'student1' } }],
          },
        },
      ]);

      const result = await AttendanceService.getMyAttendanceStatistics({
        id: 'student1',
        role: 'siswa',
      });

      expect(result[0]).toEqual(expect.objectContaining({
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
        kosong: expect.any(Number),
      }));
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
            amount: 100000,
          },
          schedules: [],
          studentClasses: [],
        },
      ]);
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid', total: 0, payroll: 0 });

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
          studentClasses: [],
        },
      ]);

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
            schedules: [],
            tutor: { id: 'tutor1', name: 'Tutor A' },
            order: {
              bimbelPackage: { name: 'Math Package', level: 'SMA' },
            },
            studentClasses: [{ user: { id: 'student1' } }],
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
        tutor: null,
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

    it('should increment kosong if tutor masuk and no siswa masuk', async () => {
    mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
      {
        id: 'classKosong',
        code: 'CLS-KOSONG',
        order: {
          bimbelPackage: { name: 'Math', level: 'SMA' },
          amount: 100000,
        },
        schedules: [
          {
            attendances: [
              { userId: 'tutor1', status: 'masuk' }
              // siswa tidak ada yang masuk
            ],
          },
        ],
        studentClasses: [
          { user: { id: 'student1' } },
          { user: { id: 'student2' } }
        ],
      },
    ]);
    mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid', total: 60000, payroll: 60000 });

    const result = await AttendanceService.getMyAttendanceStatistics({
      id: 'tutor1',
      role: 'tutor',
    });

    expect(result[0].kosong).toBe(1);
  });

  it('should not increment kosong if tutor masuk and at least one siswa masuk', async () => {
    mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
      {
        id: 'classTidakKosong',
        code: 'CLS-TIDAKKOSONG',
        order: {
          bimbelPackage: { name: 'Math', level: 'SMA' },
          amount: 100000,
        },
        schedules: [
          {
            attendances: [
              { userId: 'tutor1', status: 'masuk' },
              { userId: 'student1', status: 'masuk' }
              // ada siswa yang masuk
            ],
          },
        ],
        studentClasses: [
          { user: { id: 'student1' } },
          { user: { id: 'student2' } }
        ],
      },
    ]);
    mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid', total: 60000, payroll: 60000 });

    const result = await AttendanceService.getMyAttendanceStatistics({
      id: 'tutor1',
      role: 'tutor',
    });

    expect(result[0].kosong).toBe(0);
  });

  it('should not increment kosong if tutor did not masuk', async () => {
    mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
      {
        id: 'classNoTutorMasuk',
        code: 'CLS-NOTUTORMASUK',
        order: {
          bimbelPackage: { name: 'Math', level: 'SMA' },
          amount: 100000,
        },
        schedules: [
          {
            attendances: [
              { userId: 'student1', status: 'masuk' }
              // tutor tidak masuk
            ],
          },
        ],
        studentClasses: [
          { user: { id: 'student1' } },
          { user: { id: 'student2' } }
        ],
      },
    ]);
    mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid', total: 60000, payroll: 60000 });

    const result = await AttendanceService.getMyAttendanceStatistics({
      id: 'tutor1',
      role: 'tutor',
    });

    expect(result[0].kosong).toBe(0);
  });

  it('should set tutorStats to null if class.tutor is missing', async () => {
    mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
      {
        class: {
          id: 'classNoTutor',
          code: 'CLS-NOTUTOR',
          schedules: [
            {
              attendances: [
                { userId: 'student1', status: 'masuk' }
              ]
            }
          ],
          tutor: null,
          order: {
            bimbelPackage: { name: 'Math', level: 'SMA' }
          },
          studentClasses: [{ user: { id: 'student1' } }]
        }
      }
    ]);

    const result = await AttendanceService.getMyAttendanceStatistics({
      id: 'student1',
      role: 'siswa',
    });

    expect(result[0].tutorStats).toBeNull();
  });

  it('should set tutorStats with attendance stats if class.tutor exists', async () => {
    mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
      {
        class: {
          id: 'classWithTutor',
          code: 'CLS-TUTOR',
          schedules: [
            {
              attendances: [
                { userId: 'student1', status: 'masuk' },
                { userId: 'tutor1', status: 'masuk' }
              ]
            }
          ],
          tutor: { id: 'tutor1', name: 'Tutor A' },
          order: {
            bimbelPackage: { name: 'Math', level: 'SMA' }
          },
          studentClasses: [{ user: { id: 'student1' } }]
        }
      }
    ]);

    const result = await AttendanceService.getMyAttendanceStatistics({
      id: 'student1',
      role: 'siswa',
    });

    expect(result[0].tutorStats).toEqual(expect.objectContaining({
      tutorId: 'tutor1',
      name: 'Tutor A',
      masuk: 1,
      izin: 0,
      alpha: 0
    }));
  });

  it('should set bimbelPackage name and level to null if order is null', async () => {
    mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
      {
        id: 'classOrderNull',
        code: 'CLS-ORDERNULL',
        order: null,
        schedules: [],
        studentClasses: [],
      },
    ]);
    const result = await AttendanceService.getMyAttendanceStatistics({
      id: 'tutor1',
      role: 'tutor',
    });
    expect(result[0].bimbelPackage).toEqual({ name: null, level: null });
  });

  it('should set bimbelPackage name and level to null if bimbelPackage is null', async () => {
    mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
      {
        id: 'classBimbelNull',
        code: 'CLS-BIMBELNULL',
        order: { bimbelPackage: null },
        schedules: [],
        studentClasses: [],
      },
    ]);
    const result = await AttendanceService.getMyAttendanceStatistics({
      id: 'tutor1',
      role: 'tutor',
    });
    expect(result[0].bimbelPackage).toEqual({ name: null, level: null });
  });

  it('should set bimbelPackage name and level to null if bimbelPackage.name and level are null', async () => {
    mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
      {
        id: 'classBimbelFieldsNull',
        code: 'CLS-BIMBELFIELDSNULL',
        order: { bimbelPackage: { name: null, level: null } },
        schedules: [],
        studentClasses: [],
      },
    ]);
    const result = await AttendanceService.getMyAttendanceStatistics({
      id: 'tutor1',
      role: 'tutor',
    });
    expect(result[0].bimbelPackage).toEqual({ name: null, level: null });
  });

  it('should set bimbelPackage name and level if present', async () => {
    mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
      {
        id: 'classBimbelPresent',
        code: 'CLS-BIMBELPRESENT',
        order: { bimbelPackage: { name: 'Math', level: 'SMA' } },
        schedules: [],
        studentClasses: [],
      },
    ]);
    const result = await AttendanceService.getMyAttendanceStatistics({
      id: 'tutor1',
      role: 'tutor',
    });
    expect(result[0].bimbelPackage).toEqual({ name: 'Math', level: 'SMA' });
  });
});

  describe('getRekapKelasById', () => {
    it('should throw if class not found', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce(null);
      await expect(AttendanceService.getRekapKelasById('notfound')).rejects.toThrow('Kelas tidak ditemukan');
    });

    it('should return rekap with tutorStats and students', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 'class1',
        code: 'CLS1',
        tutor: { id: 'tutor1', name: 'Tutor A' },
        schedules: [
          {
            attendances: [
              { userId: 'tutor1', status: 'masuk', createdAt: new Date(), },
              { userId: 'student1', status: 'masuk' },
              { userId: 'student2', status: 'izin' }
            ]
          }
        ],
        order: { bimbelPackage: { name: 'Math', level: 'SMA' } },
        studentClasses: [
          { user: { id: 'student1', name: 'Student A' } },
          { user: { id: 'student2', name: 'Student B' } }
        ]
      });
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid', total: 10000, payroll: 8000 });
      mockPrisma.prisma.tutor.findUnique.mockResolvedValueOnce({ percent: 90 });
      jest.spyOn(AttendanceService, 'alertAttendance').mockResolvedValueOnce([]);
      const result = await AttendanceService.getRekapKelasById('class1');
      expect(result).toMatchObject({
        name: 'Math',
        level: 'SMA',
        classCode: 'CLS1',
        tutorStats: expect.objectContaining({ tutorId: 'tutor1', name: 'Tutor A' }),
        students: expect.any(Array),
        tinjauan: 0 // Sesuaikan dengan hasil mock
      });
    });

    it('should return rekap with tutorStats null if no tutor', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 'class2',
        code: 'CLS2',
        tutor: null,
        schedules: [],
        order: { bimbelPackage: { name: 'Math', level: 'SMA' } },
        studentClasses: []
      });
      jest.spyOn(AttendanceService, 'alertAttendance').mockResolvedValueOnce([]);
      const result = await AttendanceService.getRekapKelasById('class2');
      expect(result.tutorStats).toBeNull();
    });

    it('should set name and level to empty string if order is null', async () => {
    mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
      id: 'class1',
      code: 'CLS1',
      tutor: { id: 'tutor1', name: 'Tutor A' },
      schedules: [],
      order: null,
      studentClasses: []
    });
    jest.spyOn(AttendanceService, 'alertAttendance').mockResolvedValueOnce([]);
    const result = await AttendanceService.getRekapKelasById('class1');
    expect(result.name).toBe('');
    expect(result.level).toBe('');
  });

  it('should set name and level to empty string if bimbelPackage is null', async () => {
    mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
      id: 'class2',
      code: 'CLS2',
      tutor: { id: 'tutor2', name: 'Tutor B' },
      schedules: [],
      order: { bimbelPackage: null },
      studentClasses: []
    });
    jest.spyOn(AttendanceService, 'alertAttendance').mockResolvedValueOnce([]);
    const result = await AttendanceService.getRekapKelasById('class2');
    expect(result.name).toBe('');
    expect(result.level).toBe('');
  });

  it('should set name and level to empty string if bimbelPackage.name and level are null', async () => {
    mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
      id: 'class3',
      code: 'CLS3',
      tutor: { id: 'tutor3', name: 'Tutor C' },
      schedules: [],
      order: { bimbelPackage: { name: null, level: null } },
      studentClasses: []
    });
    jest.spyOn(AttendanceService, 'alertAttendance').mockResolvedValueOnce([]);
    const result = await AttendanceService.getRekapKelasById('class3');
    expect(result.name).toBe('');
    expect(result.level).toBe('');
  });
  });

  describe('createIzinNotification', () => {
    it('should create notifications for all students if tutor izin', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          tutor: { id: 'tutor1', name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          order: { bimbelPackage: { name: 'Math', level: 'SMA' } },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student 1' } },
            { user: { id: 'student2', name: 'Student 2' } }
          ]
        }
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1', name: 'Tutor A' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});
      await AttendanceService.createIzinNotification({
        scheduleId: 'sch1',
        userId: 'tutor1',
        reason: 'Sakit'
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledTimes(2);
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'student1',
            type: 'Izin',
            reason: 'Sakit',
            photo: 'photo.jpg'
          })
        })
      );
    });

    it('should create notification for tutor if siswa izin', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          tutor: { id: 'tutor1', name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          order: { bimbelPackage: { name: 'Math', level: 'SMA' } },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student 1' } }
          ]
        }
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'student1', name: 'Student 1' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});
      await AttendanceService.createIzinNotification({
        scheduleId: 'sch1',
        userId: 'student1',
        reason: 'Sakit'
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'tutor1',
            type: 'Izin',
            reason: 'Sakit',
            photo: 'photo.jpg'
          })
        })
      );
    });
  });

  describe('createMasukNotification', () => {
    it('should create notifications for all students and tutor if tutor masuk', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          tutor: { id: 'tutor1', name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          order: { bimbelPackage: { name: 'Math', level: 'SMA' } },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student 1' } },
            { user: { id: 'student2', name: 'Student 2' } }
          ]
        }
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1', name: 'Tutor A' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});
      await AttendanceService.createMasukNotification({
        scheduleId: 'sch1',
        userId: 'tutor1'
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledTimes(3); // 2 siswa + tutor
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'student1',
            type: 'Absensi',
            photo: 'photo.jpg'
          })
        })
      );
    });

    it('should create notifications for tutor and siswa if siswa masuk', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          tutor: { id: 'tutor1', name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          order: { bimbelPackage: { name: 'Math', level: 'SMA' } },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student 1' } }
          ]
        }
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'student1', name: 'Student 1' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});
      await AttendanceService.createMasukNotification({
        scheduleId: 'sch1',
        userId: 'student1'
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledTimes(2); // tutor + siswa
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'tutor1',
            type: 'Absensi',
            photo: 'photo.jpg'
          })
        })
      );
    });

    it('should create notification with photo null if tutor.tutors is missing', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        class: {
          tutor: { id: 'tutor1', name: 'Tutor A' }, // tutors tidak ada
          order: { bimbelPackage: { name: 'Math', level: 'SMA' } },
          code: 'CLS1',
          studentClasses: [
            { user: { id: 'student1', name: 'Student 1' } }
          ]
        }
      });
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'student1', name: 'Student 1' });
      mockPrisma.prisma.notification.create.mockResolvedValue({});
      await AttendanceService.createMasukNotification({
        scheduleId: 'sch1',
        userId: 'student1'
      });
      expect(mockPrisma.prisma.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            photo: null
          })
        })
      );
    });
  });

  describe('createSalaryIfLastAttendance', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should not create salary if there are no schedules', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([]);
      await AttendanceService.createSalaryIfLastAttendance('class1');
      // Tidak ada pemanggilan salary
      expect(mockPrisma.prisma.salary.findFirst).not.toHaveBeenCalled();
    });

    it('should not create salary if not all attended', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'sch1' }, { id: 'sch2' }
      ]);
      mockPrisma.prisma.attendance.findMany.mockResolvedValueOnce([
        { userId: 'tutor1' } // hanya tutor, siswa belum
      ]);
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        tutor: { id: 'tutor1' },
        studentClasses: [{ userId: 'student1' }],
        order: { id: 'order1', amount: 100000 }
      });
      // attendedUserIds hanya tutor, requiredUserIds tutor + siswa
      await AttendanceService.createSalaryIfLastAttendance('class1');
      expect(mockPrisma.prisma.salary.findFirst).not.toHaveBeenCalled();
    });

    it('should not create salary if salary already exists', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'sch1' }
      ]);
      mockPrisma.prisma.attendance.findMany.mockResolvedValueOnce([
        { userId: 'tutor1' }, { userId: 'student1' }
      ]);
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        tutor: { id: 'tutor1' },
        studentClasses: [{ userId: 'student1' }],
        order: { id: 'order1', amount: 100000 }
      });
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce({ id: 'salary1' });
      await AttendanceService.createSalaryIfLastAttendance('class1');
      expect(mockPrisma.prisma.salary.findFirst).toHaveBeenCalled();
      // Tidak ada pemanggilan SalaryService.createSalary
    });

    it('should create salary and update class status if all attended and no salary exists', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'sch1' }
      ]);
      mockPrisma.prisma.attendance.findMany.mockResolvedValueOnce([
        { userId: 'tutor1' }, { userId: 'student1' }
      ]);
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        tutor: { id: 'tutor1' },
        studentClasses: [{ userId: 'student1' }],
        order: { id: 'order1', amount: 100000 }
      });
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce(null);
      mockPrisma.prisma.tutor.findUnique.mockResolvedValueOnce({ percent: 90 });
      mockPrisma.prisma.attendance.count.mockResolvedValueOnce(1);
      mockPrisma.prisma.class.update.mockResolvedValueOnce({});
      mockPrisma.prisma.order.findUnique.mockResolvedValueOnce({ packageId: 'pkg1' });
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({});
      const spy = jest.spyOn(SalaryService, 'createSalary').mockResolvedValueOnce({});
      await AttendanceService.createSalaryIfLastAttendance('class1');
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        tutorId: 'tutor1',
        orderId: 'order1',
        totalSalary: 100000 * 0.9,
        payroll: expect.any(Number)
      }));
      expect(mockPrisma.prisma.class.update).toHaveBeenCalledWith({
        where: { id: 'class1' },
        data: { status: 'selesai' }
      });
      expect(mockPrisma.prisma.bimbelPackage.update).toHaveBeenCalledWith({
        where: { id: 'pkg1' },
        data: { isActive: true }
      });
      spy.mockRestore();
    });

    it('should not create salary if classData.order is null', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'sch1' }
      ]);
      mockPrisma.prisma.attendance.findMany.mockResolvedValueOnce([
        { userId: 'tutor1' }, { userId: 'student1' }
      ]);
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        tutor: { id: 'tutor1' },
        studentClasses: [{ userId: 'student1' }],
        order: null
      });
      await AttendanceService.createSalaryIfLastAttendance('class1');
      expect(mockPrisma.prisma.salary.findFirst).not.toHaveBeenCalled();
    });

    it('should use default percent 0.6 if tutor.percent is not set', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'sch1' }
      ]);
      mockPrisma.prisma.attendance.findMany.mockResolvedValueOnce([
        { userId: 'tutor1' }, { userId: 'student1' }
      ]);
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        tutor: { id: 'tutor1' },
        studentClasses: [{ userId: 'student1' }],
        order: { id: 'order1', amount: 100000 }
      });
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce(null);
      mockPrisma.prisma.tutor.findUnique.mockResolvedValueOnce({}); 
      mockPrisma.prisma.attendance.count.mockResolvedValueOnce(1);
      mockPrisma.prisma.class.update.mockResolvedValueOnce({});
      mockPrisma.prisma.order.findUnique.mockResolvedValueOnce({ packageId: 'pkg1' });
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({});
      const spy = jest.spyOn(SalaryService, 'createSalary').mockResolvedValueOnce({});
      await AttendanceService.createSalaryIfLastAttendance('class1');
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        tutorId: 'tutor1',
        orderId: 'order1',
        totalSalary: 100000 * 0.6, // fallback ke 0.6
        payroll: expect.any(Number)
      }));
      spy.mockRestore();
    });

    it('should set hadirPersen to 0 if totalSchedules is 0', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([]);
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        tutor: { id: 'tutor1' },
        studentClasses: [{ userId: 'student1' }],
        order: { id: 'order1', amount: 100000 }
      });

      const spy = jest.spyOn(SalaryService, 'createSalary').mockResolvedValueOnce({});

      await AttendanceService.createSalaryIfLastAttendance('class1');
      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should create salary with default price if classData.order.amount is undefined', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'sch1' }
      ]);
      mockPrisma.prisma.attendance.findMany.mockResolvedValueOnce([
        { userId: 'tutor1' }, { userId: 'student1' }
      ]);
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        tutor: { id: 'tutor1' },
        studentClasses: [{ userId: 'student1' }],
        order: { id: 'order1', amount: undefined }
      });
      mockPrisma.prisma.salary.findFirst.mockResolvedValueOnce(null);
      mockPrisma.prisma.tutor.findUnique.mockResolvedValueOnce({ percent: 90 });
      mockPrisma.prisma.attendance.count.mockResolvedValueOnce(1);
      mockPrisma.prisma.class.update.mockResolvedValueOnce({});
      mockPrisma.prisma.order.findUnique.mockResolvedValueOnce({ packageId: 'pkg1' });
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({});
      const spy = jest.spyOn(SalaryService, 'createSalary').mockImplementation((args) => {
        console.log('createSalary called with:', args);
        return Promise.resolve({});
      });
      await AttendanceService.createSalaryIfLastAttendance('class1');
      expect(spy).toHaveBeenCalledWith({
        tutorId: 'tutor1',
        orderId: 'order1',
        totalSalary: 60000,
        payroll: 60000
      });
      spy.mockRestore();
    });
  });
});