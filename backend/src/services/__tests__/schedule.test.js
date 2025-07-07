import { jest } from '@jest/globals';

const prisma = {
  class: { findUnique: jest.fn(), findMany: jest.fn() },
  schedule: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    count: jest.fn()
  },
  studentClass: { findMany: jest.fn() },
  user: { findUnique: jest.fn() },
  tutor: { findUnique: jest.fn() },
  notification: { create: jest.fn() }
};

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma
}));

const { ScheduleService } = await import('../schedule.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ScheduleService', () => {
  describe('createSchedules', () => {
    it('throws if class not found', async () => {
      prisma.class.findUnique.mockResolvedValueOnce(null);
      await expect(ScheduleService.createSchedules('classX')).rejects.toThrow('Class not found');
    });

    it('throws if totalMeetings invalid', async () => {
      prisma.class.findUnique.mockResolvedValueOnce({
        code: 'CLS123',
        order: { bimbelPackage: { totalMeetings: 0 } }
      });
      await expect(ScheduleService.createSchedules('classX')).rejects.toThrow('Invalid totalMeetings in bimbelPackage');
    });

    it('throws if time invalid', async () => {
      prisma.class.findUnique.mockResolvedValueOnce({
        code: 'CLS123',
        order: { bimbelPackage: { totalMeetings: 1, time: 'not-a-date' } }
      });
      await expect(ScheduleService.createSchedules('classX')).rejects.toThrow('Invalid time format in bimbelPackage');
    });

    it('creates schedules with valid input (startDate valid)', async () => {
      const now = new Date();
      prisma.class.findUnique.mockResolvedValueOnce({
        code: 'CLS123',
        order: {
          bimbelPackage: {
            totalMeetings: 1,
            time: now.toISOString(),
            name: 'IPA',
            level: 'Lanjutan',
            packageDay: [{ day: { daysName: 'Senin' } }],
            startDate: now.toISOString()
          }
        }
      });
      prisma.schedule.findUnique.mockResolvedValueOnce(null);
      prisma.schedule.createMany.mockResolvedValue({ count: 1 });
      prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'scheduleX', classId: 'classX', date: now, meet: 1, status: 'terjadwal', slug: 'slug' }
      ]);
      const result = await ScheduleService.createSchedules('classX');
      expect(result[0].id).toBe('scheduleX');
    });

    it('creates schedules with today as startDate if startDate invalid', async () => {
      const now = new Date();
      prisma.class.findUnique.mockResolvedValueOnce({
        code: 'ABC123',
        order: {
          bimbelPackage: {
            totalMeetings: 1,
            time: now.toISOString(),
            name: 'IPA',
            level: 'Lanjutan',
            packageDay: [{ day: { daysName: 'Senin' } }],
            startDate: 'invalid-date'
          }
        }
      });
      prisma.schedule.findUnique.mockResolvedValueOnce(null);
      prisma.schedule.createMany.mockResolvedValue({ count: 1 });
      prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'scheduleY', classId: 'classY', date: now, meet: 1, status: 'terjadwal', slug: 'slug' }
      ]);
      const result = await ScheduleService.createSchedules('classY');
      expect(result[0].id).toBe('scheduleY');
    });

    it('does not create more schedules than totalMeetings even if days array is longer', async () => {
      const now = new Date();
      prisma.class.findUnique.mockResolvedValueOnce({
        code: 'CLS123',
        order: {
          bimbelPackage: {
            totalMeetings: 2,
            time: now.toISOString(),
            name: 'IPA',
            level: 'Dasar',
            packageDay: [
              { day: { daysName: 'Senin' } },
              { day: { daysName: 'Selasa' } },
              { day: { daysName: 'Rabu' } }
            ],
            startDate: now.toISOString()
          }
        }
      });
      prisma.schedule.findUnique.mockResolvedValue(null);
      prisma.schedule.createMany.mockResolvedValue({ count: 2 });
      prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'schedule1', classId: 'classX', date: now, meet: 1, status: 'terjadwal', slug: 'slug1' },
        { id: 'schedule2', classId: 'classX', date: now, meet: 2, status: 'terjadwal', slug: 'slug2' }
      ]);
      const result = await ScheduleService.createSchedules('classX');
      expect(result.length).toBe(2);
      expect(result[0].meet).toBe(1);
      expect(result[1].meet).toBe(2);
    });
    
    it('creates schedules for all days if totalMeetings >= days.length', async () => {
      const now = new Date();
      prisma.class.findUnique.mockResolvedValueOnce({
        code: 'CLS124',
        order: {
          bimbelPackage: {
            totalMeetings: 3,
            time: now.toISOString(),
            name: 'IPA',
            level: 'Dasar',
            packageDay: [
              { day: { daysName: 'Senin' } },
              { day: { daysName: 'Selasa' } }
            ],
            startDate: now.toISOString()
          }
        }
      });
      prisma.schedule.findUnique.mockResolvedValue(null);
      prisma.schedule.createMany.mockResolvedValue({ count: 3 });
      prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'schedule1', classId: 'classY', date: now, meet: 1, status: 'terjadwal', slug: 'slug1' },
        { id: 'schedule2', classId: 'classY', date: now, meet: 2, status: 'terjadwal', slug: 'slug2' },
        { id: 'schedule3', classId: 'classY', date: now, meet: 3, status: 'terjadwal', slug: 'slug3' }
      ]);
      const result = await ScheduleService.createSchedules('classY');
      expect(result.length).toBe(3);
      expect(result[0].meet).toBe(1);
      expect(result[1].meet).toBe(2);
      expect(result[2].meet).toBe(3);
    });

    it('creates schedule for today if startDate is same as first day and meet is 1', async () => {
      // Start date is Monday, first day in packageDay is also Monday
      const monday = new Date('2025-07-07T08:00:00.000Z'); // Monday
      prisma.class.findUnique.mockResolvedValueOnce({
        code: 'CLS777',
        order: {
          bimbelPackage: {
            totalMeetings: 1,
            time: monday.toISOString(),
            name: 'IPA',
            level: 'Dasar',
            packageDay: [{ day: { daysName: 'Senin' } }],
            startDate: monday.toISOString()
          }
        }
      });
      prisma.schedule.findUnique.mockResolvedValue(null);
      prisma.schedule.createMany.mockResolvedValue({ count: 1 });
      prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'scheduleToday', classId: 'CLS777', date: monday, meet: 1, status: 'terjadwal', slug: 'slug-today' }
      ]);
      const result = await ScheduleService.createSchedules('CLS777');
      expect(result.length).toBe(1);
      expect(result[0].date.getDay()).toBe(1); // Monday
      expect(result[0].id).toBe('scheduleToday');
    });
    
    it('creates schedule for next available day if today is not the target day', async () => {
      // Start date is Sunday, first day in packageDay is Monday
      const sunday = new Date('2025-07-06T08:00:00.000Z'); // Sunday
      const monday = new Date('2025-07-07T08:00:00.000Z'); // Monday
      prisma.class.findUnique.mockResolvedValueOnce({
        code: 'CLS778',
        order: {
          bimbelPackage: {
            totalMeetings: 1,
            time: monday.toISOString(),
            name: 'IPA',
            level: 'Dasar',
            packageDay: [{ day: { daysName: 'Senin' } }],
            startDate: sunday.toISOString()
          }
        }
      });
      prisma.schedule.findUnique.mockResolvedValue(null);
      prisma.schedule.createMany.mockResolvedValue({ count: 1 });
      prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'scheduleNext', classId: 'CLS778', date: monday, meet: 1, status: 'terjadwal', slug: 'slug-next' }
      ]);
      const result = await ScheduleService.createSchedules('CLS778');
      expect(result.length).toBe(1);
      expect(result[0].date.getDay()).toBe(1); // Monday
      expect(result[0].id).toBe('scheduleNext');
    });
  });

  describe('getClosestSchedules', () => {
    it('throws if no schedules found', async () => {
      prisma.schedule.findMany.mockResolvedValueOnce([]);
      prisma.schedule.count.mockResolvedValueOnce(0);
      await expect(ScheduleService.getClosestSchedules()).rejects.toThrow('No schedules found');
    });

    it('returns closest schedules successfully', async () => {
      const now = new Date();
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          slug: 'schedule-slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getClosestSchedules();
      expect(result.data[0]).toMatchObject({
        id: 'schedule1',
        classCode: 'CLS123',
        tutorName: 'Pak Tutor A',
        status: 'terjadwal',
        slug: 'schedule-slug'
      });
      expect(result.total).toBe(1);
    });

    it('returns tutorName with prefix if tutor and gender exist', async () => {
      const now = new Date();
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          slug: 'slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getClosestSchedules();
      expect(result.data[0].tutorName).toBe('Pak Udin');
    });
    
    it('returns tutorName with prefix Bu if gender is not Male', async () => {
      const now = new Date();
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule2',
          class: {
            code: 'CLS124',
            order: {},
            tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] }
          },
          meet: 2,
          date: now,
          status: 'terjadwal',
          slug: 'slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getClosestSchedules();
      expect(result.data[0].tutorName).toBe('Bu Siti');
    });
    
    it('returns tutorName with prefix Bu if tutors array is empty', async () => {
      const now = new Date();
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule3',
          class: {
            code: 'CLS125',
            order: {},
            tutor: { name: 'Ani', tutors: [] }
          },
          meet: 3,
          date: now,
          status: 'terjadwal',
          slug: 'slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getClosestSchedules();
      expect(result.data[0].tutorName).toBe('Bu Ani');
    });
    
    it('returns tutorName null if tutor does not exist', async () => {
      const now = new Date();
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule4',
          class: {
            code: 'CLS126',
            order: {},
            tutor: null
          },
          meet: 4,
          date: now,
          status: 'terjadwal',
          slug: 'slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getClosestSchedules();
      expect(result.data[0].tutorName).toBeNull();
    });

    it('returns null for slug if schedule.slug is missing', async () => {
        const now = new Date();
        prisma.schedule.findMany.mockResolvedValueOnce([
            {
            id: 'schedule2',
            class: {
                code: 'CLS124',
                order: {},
                tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
            },
            meet: 2,
            date: now,
            status: 'terjadwal'
            // slug tidak ada
            }
        ]);
        prisma.schedule.count.mockResolvedValueOnce(1);
        const result = await ScheduleService.getClosestSchedules();
        expect(result.data[0].slug).toBeNull();
    });
  });

  describe('getSchedulesForStudent', () => {
    it('returns empty data if no studentClass', async () => {
      prisma.studentClass.findMany.mockResolvedValueOnce([]);
      const result = await ScheduleService.getSchedulesForStudent('student1');
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });
    });

    it('returns empty data if no runningClass', async () => {
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.class.findMany.mockResolvedValueOnce([]);
      const result = await ScheduleService.getSchedulesForStudent('student1');
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });
    });

    it('returns schedules for the student successfully', async () => {
      const now = new Date();
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [{ status: 'terjadwal' }],
          slug: 'schedule-slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForStudent('student1');
      expect(result.data[0]).toMatchObject({
        id: 'schedule1',
        classCode: 'CLS123',
        tutorName: 'Pak Tutor A',
        status: 'terjadwal',
        slug: 'schedule-slug'
      });
      expect(result.total).toBe(1);
    });

    it('returns status from attendance if attendance exists', async () => {
      const now = new Date();
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [{ status: 'masuk' }]
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForStudent('student1');
      expect(result.data[0].status).toBe('masuk');
    });
    
    it('returns status from schedule if attendance does not exist', async () => {
      const now = new Date();
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule2',
          class: {
            code: 'CLS124',
            order: {},
            tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }
          },
          meet: 2,
          date: now,
          status: 'terjadwal',
          attendances: []
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForStudent('student1');
      expect(result.data[0].status).toBe('terjadwal');
    });

    it('returns slug if schedule.slug exists', async () => {
      const now = new Date();
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [{ status: 'terjadwal' }],
          slug: 'slug-ada'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForStudent('student1');
      expect(result.data[0].slug).toBe('slug-ada');
    });
    
    it('returns null for slug if schedule.slug is missing', async () => {
      const now = new Date();
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule2',
          class: {
            code: 'CLS124',
            order: {},
            tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }
          },
          meet: 2,
          date: now,
          status: 'terjadwal',
          attendances: [{ status: 'terjadwal' }]
          // slug tidak ada
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForStudent('student1');
      expect(result.data[0].slug).toBeNull();
    });
  });

  describe('getSchedulesForTutor', () => {
    it('returns empty data if no runningClass', async () => {
      prisma.class.findMany.mockResolvedValueOnce([]);
      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 });
    });

    it('returns schedules for the tutor successfully', async () => {
      const now = new Date();
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [{ status: 'terjadwal' }],
          slug: 'schedule-slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      expect(result.data[0]).toMatchObject({
        id: 'schedule1',
        classCode: 'CLS123',
        tutorName: 'Pak Tutor A',
        status: 'terjadwal',
        slug: 'schedule-slug'
      });
      expect(result.total).toBe(1);
    });

    it('returns tutorName if tutor exists', async () => {
      const now = new Date();
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [],
          slug: 'slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      expect(result.data[0].tutorName).toBe('Pak Udin');
    });
    
    it('returns tutorName null if tutor does not exist', async () => {
      const now = new Date();
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule2',
          class: {
            code: 'CLS124',
            order: {},
            tutor: null
          },
          meet: 2,
          date: now,
          status: 'terjadwal',
          attendances: [],
          slug: 'slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      expect(result.data[0].tutorName).toBeNull();
    });
    
    it('returns status from attendance if attendance exists', async () => {
      const now = new Date();
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule3',
          class: {
            code: 'CLS125',
            order: {},
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 3,
          date: now,
          status: 'terjadwal',
          attendances: [{ status: 'masuk' }],
          slug: 'slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      expect(result.data[0].status).toBe('masuk');
    });
    
    it('returns status from schedule if attendance does not exist', async () => {
      const now = new Date();
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule4',
          class: {
            code: 'CLS126',
            order: {},
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 4,
          date: now,
          status: 'terjadwal',
          attendances: [],
          slug: 'slug'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      expect(result.data[0].status).toBe('terjadwal');
    });

    it('returns slug if schedule.slug exists', async () => {
      const now = new Date();
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [],
          slug: 'slug-ada'
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      expect(result.data[0].slug).toBe('slug-ada');
    });
    
    it('returns null for slug if schedule.slug is missing', async () => {
      const now = new Date();
      prisma.class.findMany.mockResolvedValueOnce([{ id: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule2',
          class: {
            code: 'CLS124',
            order: {},
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 2,
          date: now,
          status: 'terjadwal',
          attendances: [],
          // slug tidak ada
        }
      ]);
      prisma.schedule.count.mockResolvedValueOnce(1);
      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      expect(result.data[0].slug).toBeNull();
    });
  });

  describe('getSchedulesByRole', () => {
    it('throws if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(ScheduleService.getSchedulesByRole('userX')).rejects.toThrow('User not found');
    });
    
    it('returns undefined if user role is not siswa or tutor', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ role: 'admin' });
      const result = await ScheduleService.getSchedulesByRole('user3');
      expect(result).toBeUndefined();
    });

    it('returns student schedules if user is siswa', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ role: 'siswa' });
      prisma.studentClass.findMany.mockResolvedValueOnce([]);
      const result = await ScheduleService.getSchedulesByRole('user1', 2, 5);
      expect(result).toEqual({ data: [], total: 0, page: 2, limit: 5, totalPages: 0 });
    });

    it('returns tutor schedules if user is tutor', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ role: 'tutor' });
      prisma.class.findMany.mockResolvedValueOnce([]);
      const result = await ScheduleService.getSchedulesByRole('user2', 3, 7);
      expect(result).toEqual({ data: [], total: 0, page: 3, limit: 7, totalPages: 0 });
    });
  });

  describe('getScheduleBySlug', () => {
    it('throws if schedule not found', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce(null);
      await expect(ScheduleService.getScheduleBySlug('slug-x')).rejects.toThrow('Schedule not found');
    });

    it('returns schedule detail with all fields', async () => {
      const now = new Date();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule1',
        class: {
          code: 'CLS123',
          studentClasses: [],
          order: {},
          tutor: { name: 'Udin', tutors: [{ gender: 'Male', phone: '081234' }], email: 'udin@email.com' }
        },
        meet: 1,
        date: now,
        status: 'terjadwal',
        attendances: [{ id: 'att1' }],
        information: 'Info jadwal',
        slug: 'schedule-slug'
      });
      const result = await ScheduleService.getScheduleBySlug('schedule-slug');
      expect(result).toMatchObject({
        id: 'schedule1',
        classCode: 'CLS123',
        tutorName: 'Pak Udin',
        status: 'terjadwal',
        slug: 'schedule-slug',
        studentName: []
      });
    });

    it('returns nulls for missing optional fields', async () => {
      const now = new Date();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule2',
        class: {
          code: 'CLS124',
          studentClasses: [],
          order: {},
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] }
        },
        meet: 2,
        date: now,
        status: 'terjadwal',
        attendances: [],
        information: null,
        slug: 'schedule-slug-2'
      });
      const result = await ScheduleService.getScheduleBySlug('schedule-slug-2');
      expect(result).toMatchObject({
        id: 'schedule2',
        classCode: 'CLS124',
        tutorName: 'Bu Siti',
        status: 'terjadwal',
        slug: 'schedule-slug-2',
        studentName: []
      });
    });

    it('returns tutorName if tutor exists', async () => {
      const now = new Date();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule1',
        class: {
          code: 'CLS123',
          studentClasses: [],
          order: {},
          tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
        },
        meet: 1,
        date: now,
        status: 'terjadwal',
        attendances: [],
        information: null,
        slug: 'schedule-slug'
      });
      const result = await ScheduleService.getScheduleBySlug('schedule-slug');
      expect(result.tutorName).toBe('Pak Udin');
    });
    
    it('returns tutorName null if tutor does not exist', async () => {
      const now = new Date();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule2',
        class: {
          code: 'CLS124',
          studentClasses: [],
          order: {},
          tutor: null
        },
        meet: 2,
        date: now,
        status: 'terjadwal',
        attendances: [],
        information: null,
        slug: 'schedule-slug-2'
      });
      const result = await ScheduleService.getScheduleBySlug('schedule-slug-2');
      expect(result.tutorName).toBeNull();
    });
    
    it('returns studentNames if studentClasses with user.name exist', async () => {
      const now = new Date();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule3',
        class: {
          code: 'CLS125',
          studentClasses: [
            { user: { name: 'Budi' } },
            { user: { name: 'Ani' } }
          ],
          order: {},
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] }
        },
        meet: 3,
        date: now,
        status: 'terjadwal',
        attendances: [],
        information: null,
        slug: 'schedule-slug-3'
      });
      const result = await ScheduleService.getScheduleBySlug('schedule-slug-3');
      expect(result.studentName).toEqual(['Budi', 'Ani']);
    });
    
    it('returns empty studentNames if studentClasses empty or user.name missing', async () => {
      const now = new Date();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule4',
        class: {
          code: 'CLS126',
          studentClasses: [
            { user: {} },
            {},
          ],
          order: {},
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] }
        },
        meet: 4,
        date: now,
        status: 'terjadwal',
        attendances: [],
        information: null,
        slug: 'schedule-slug-4'
      });
      const result = await ScheduleService.getScheduleBySlug('schedule-slug-4');
      expect(result.studentName).toEqual([]);
    });

    it('returns studentNames if studentClasses with user.name exist', async () => {
      const now = new Date();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule3',
        class: {
          code: 'CLS125',
          studentClasses: [
            { user: { name: 'Budi' } },
            { user: { name: 'Ani' } }
          ],
          order: {},
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] }
        },
        meet: 3,
        date: now,
        status: 'terjadwal',
        attendances: [],
        information: null,
        slug: 'schedule-slug-3'
      });
      const result = await ScheduleService.getScheduleBySlug('schedule-slug-3');
      expect(result.studentName).toEqual(['Budi', 'Ani']);
      expect(result.slug).toBe('schedule-slug-3');
    });
    
    it('returns empty studentNames if studentClasses empty or user.name missing', async () => {
      const now = new Date();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule4',
        class: {
          code: 'CLS126',
          studentClasses: [
            { user: {} },
            {},
          ],
          order: {},
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] }
        },
        meet: 4,
        date: now,
        status: 'terjadwal',
        attendances: [],
        information: null,
        slug: 'schedule-slug-4'
      });
      const result = await ScheduleService.getScheduleBySlug('schedule-slug-4');
      expect(result.studentName).toEqual([]);
      expect(result.slug).toBe('schedule-slug-4');
    });
    
    it('returns null for slug if slug is missing', async () => {
      const now = new Date();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule5',
        class: {
          code: 'CLS127',
          studentClasses: [],
          order: {},
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] }
        },
        meet: 5,
        date: now,
        status: 'terjadwal',
        attendances: [],
        information: null,
        // slug tidak ada
      });
      const result = await ScheduleService.getScheduleBySlug('schedule-slug-5');
      expect(result.slug).toBeNull();
    });
  });

  describe('getClosestScheduleBySlug', () => {
    it('throws if no schedule found', async () => {
      prisma.schedule.findMany.mockResolvedValueOnce([]);
      await expect(ScheduleService.getClosestScheduleBySlug('slug-x')).rejects.toThrow('No upcoming schedules found for the given bimbel package slug');
    });

    it('returns closest schedules for slug', async () => {
      const now = new Date();
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {
              bimbelPackage: {
                slug: 'schedule-slug', 
                name: 'Math',
                level: 'Dasar',
                duration: 90
              }
            },
            tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [],
          information: null,
          slug: null 
        }
      ]);
      const result = await ScheduleService.getClosestScheduleBySlug('slug-x');
      expect(result[0]).toMatchObject({
        id: 'schedule1',
        classCode: 'CLS123',
        tutorName: 'Pak Tutor A',
        status: 'terjadwal',
        slug: 'schedule-slug' 
      });
    });

    it('returns tutorName if tutor exists', async () => {
      const now = new Date();
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {
              bimbelPackage: {
                slug: 'schedule-slug',
                name: 'Math',
                level: 'Dasar',
                duration: 90
              }
            },
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [],
          information: null,
          slug: null
        }
      ]);
      const result = await ScheduleService.getClosestScheduleBySlug('schedule-slug');
      expect(result[0]).toMatchObject({
        tutorName: 'Pak Udin'
      });
    });
    
    it('returns tutorName null if tutor does not exist', async () => {
      const now = new Date();
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule2',
          class: {
            code: 'CLS124',
            order: {
              bimbelPackage: {
                slug: 'schedule-slug-2',
                name: 'IPA',
                level: 'Dasar',
                duration: 90
              }
            },
            tutor: null // tutor tidak ada
          },
          meet: 2,
          date: now,
          status: 'terjadwal',
          attendances: [],
          information: null,
          slug: null
        }
      ]);
      const result = await ScheduleService.getClosestScheduleBySlug('schedule-slug-2');
      expect(result[0]).toMatchObject({
        tutorName: null
      });
    });
    
    it('returns packageName and level if bimbelPackage exists', async () => {
      const now = new Date();
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {
              bimbelPackage: {
                slug: 'schedule-slug',
                name: 'Matematika',
                level: 'Dasar',
                duration: 90
              }
            },
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [],
          information: null,
          slug: null
        }
      ]);
      const result = await ScheduleService.getClosestScheduleBySlug('schedule-slug');
      expect(result[0]).toMatchObject({
        packageName: 'Matematika',
        level: 'Dasar'
      });
    });
    
    it('returns null for packageName and level if bimbelPackage missing', async () => {
      const now = new Date();
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule2',
          class: {
            code: 'CLS124',
            order: {
            },
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 2,
          date: now,
          status: 'terjadwal',
          attendances: [],
          information: null,
          slug: null
        }
      ]);
      const result = await ScheduleService.getClosestScheduleBySlug('schedule-slug-2');
      expect(result[0]).toMatchObject({
        packageName: null,
        level: null
      });
    });
  });

  describe('getScheduleByUserId', () => {
    it('returns empty array if no studentClass', async () => {
      prisma.studentClass.findMany.mockResolvedValueOnce([]);
      const result = await ScheduleService.getScheduleByUserId('student1');
      expect(result).toEqual([]);
    });

    it('returns mapped schedules if found', async () => {
      const now = new Date();
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [{ status: 'terjadwal' }]
        }
      ]);
      const result = await ScheduleService.getScheduleByUserId('student1');
      expect(result[0]).toMatchObject({
        id: 'schedule1',
        classCode: 'CLS123',
        tutorName: 'Pak Udin',
        status: 'terjadwal'
      });
    });

    it('returns status from attendance if attendance exists', async () => {
      const now = new Date();
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: [{ status: 'masuk' }]
        }
      ]);
      const result = await ScheduleService.getScheduleByUserId('student1');
      expect(result[0]).toMatchObject({
        id: 'schedule1',
        status: 'masuk' // dari attendance
      });
    });
    
    it('returns status from schedule if attendance does not exist', async () => {
      const now = new Date();
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule2',
          class: {
            code: 'CLS124',
            order: {},
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 2,
          date: now,
          status: 'terjadwal',
          attendances: [] 
        }
      ]);
      const result = await ScheduleService.getScheduleByUserId('student1');
      expect(result[0]).toMatchObject({
        id: 'schedule2',
        status: 'terjadwal' 
      });
    });

    it('returns tutorName if tutor exists', async () => {
      const now = new Date();
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          class: {
            code: 'CLS123',
            order: {},
            tutor: { name: 'Udin', tutors: [{ gender: 'Male' }] }
          },
          meet: 1,
          date: now,
          status: 'terjadwal',
          attendances: []
        }
      ]);
      const result = await ScheduleService.getScheduleByUserId('student1');
      expect(result[0].tutorName).toBe('Pak Udin');
    });
    
    it('returns tutorName null if tutor does not exist', async () => {
      const now = new Date();
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule2',
          class: {
            code: 'CLS124',
            order: {},
            tutor: null
          },
          meet: 2,
          date: now,
          status: 'terjadwal',
          attendances: []
        }
      ]);
      const result = await ScheduleService.getScheduleByUserId('student1');
      expect(result[0].tutorName).toBeNull();
    });
  });

  describe('reschedule', () => {
    const req = {};
    const res = { locals: { user: { id: 'admin' } } };

    it('throws if newDate is not provided', async () => {
      await expect(ScheduleService.reschedule('schedule1', undefined, req, res)).rejects.toThrow('Invalid new date format');
    });

    it('throws if newDate is invalid', async () => {
      await expect(ScheduleService.reschedule('schedule1', 'not-a-date', req, res)).rejects.toThrow('Invalid new date format');
    });

    it('throws if newDate is in the past', async () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      await expect(ScheduleService.reschedule('schedule1', yesterday, req, res)).rejects.toThrow('New date cannot be in the past');
    });

    it('throws if schedule not found', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce(null);
      await expect(ScheduleService.reschedule('schedule1', new Date(Date.now() + 86400000).toISOString(), req, res)).rejects.toThrow('Schedule not found');
    });

    it('throws if schedule already rescheduled', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce({
        status: 'jadwal_ulang',
        attendances: [],
        class: { order: { bimbelPackage: {}, user: {} } }
      });
      await expect(ScheduleService.reschedule('schedule1', new Date(Date.now() + 86400000).toISOString(), req, res)).rejects.toThrow('Reschedule can only be done once');
    });

    it('throws if attendance status is masuk', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce({
        status: 'terjadwal',
        attendances: [{ status: 'masuk' }],
        class: { order: { bimbelPackage: {}, user: {} } }
      });
      await expect(ScheduleService.reschedule('schedule1', new Date(Date.now() + 86400000).toISOString(), req, res)).rejects.toThrow('Cannot reschedule after attendance has been recorded');
    });

    it('throws if attendance status is izin', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce({
        status: 'terjadwal',
        attendances: [{ status: 'izin' }],
        class: { order: { bimbelPackage: {}, user: {} } }
      });
      await expect(ScheduleService.reschedule('schedule1', new Date(Date.now() + 86400000).toISOString(), req, res)).rejects.toThrow('Cannot reschedule after attendance has been recorded');
    });

    it('reschedules successfully if all conditions are met', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        status: 'terjadwal',
        attendances: [],
        class: {
          code: 'CLS123',
          order: {
            bimbelPackage: { name: 'Math', level: 'Dasar', userId: 'tutor1' },
            user: { id: 'student1' }
          }
        }
      });
      prisma.schedule.update.mockResolvedValueOnce({ id: 'schedule1', date: futureDate, status: 'jadwal_ulang' });
      prisma.tutor.findUnique.mockResolvedValueOnce({ userId: 'tutor1', user: { name: 'Udin' } });
      prisma.notification.create.mockResolvedValue({});
      const result = await ScheduleService.reschedule('schedule1', futureDate, req, res);
      expect(result).toMatchObject({ id: 'schedule1', date: futureDate, status: 'jadwal_ulang' });
    });

    it('sets actorForStudent and actorForTutor as Admin if isAdmin true', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        status: 'terjadwal',
        attendances: [],
        class: {
          code: 'CLS123',
          order: {
            bimbelPackage: { name: 'Math', level: 'Dasar', userId: 'tutor1' },
            user: { id: 'student1' }
          }
        }
      });
      prisma.schedule.update.mockResolvedValueOnce({ id: 'schedule1', date: futureDate, status: 'jadwal_ulang' });
      prisma.tutor.findUnique.mockResolvedValueOnce({ userId: 'tutor1', user: { name: 'Udin' }, photo: null });
      prisma.notification.create.mockResolvedValue({});
      const req = {};
      const res = { locals: { user: { id: 'admin' } } };
      await ScheduleService.reschedule('schedule1', futureDate, req, res, true);
      // Cek di notification.create dipanggil dengan description mengandung 'Admin'
      expect(prisma.notification.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          description: expect.stringContaining('Admin')
        })
      }));
    });
    
    it('sets actorForTutor as Anda if loggedInUser.id === tutor.userId', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        status: 'terjadwal',
        attendances: [],
        class: {
          code: 'CLS123',
          order: {
            bimbelPackage: { name: 'Math', level: 'Dasar', userId: 'tutor1' },
            user: { id: 'student1' }
          }
        }
      });
      prisma.schedule.update.mockResolvedValueOnce({ id: 'schedule1', date: futureDate, status: 'jadwal_ulang' });
      prisma.tutor.findUnique.mockResolvedValueOnce({ userId: 'tutor1', user: { name: 'Udin' }, photo: null });
      prisma.notification.create.mockResolvedValue({});
      const req = {};
      const res = { locals: { user: { id: 'tutor1' } } };
      await ScheduleService.reschedule('schedule1', futureDate, req, res, false);
      // Cek description untuk tutor mengandung 'Anda'
      expect(prisma.notification.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          description: expect.stringContaining('Anda')
        })
      }));
    });
    
    it('sets actorForTutor as getTutorName if loggedInUser.id !== tutor.userId and not admin', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      prisma.schedule.findUnique.mockResolvedValueOnce({
        status: 'terjadwal',
        attendances: [],
        class: {
          code: 'CLS123',
          order: {
            bimbelPackage: { name: 'Math', level: 'Dasar', userId: 'tutor1' },
            user: { id: 'student1' }
          }
        }
      });
      prisma.schedule.update.mockResolvedValueOnce({ id: 'schedule1', date: futureDate, status: 'jadwal_ulang' });
      prisma.tutor.findUnique.mockResolvedValueOnce({ userId: 'tutor1', user: { name: 'Udin' }, photo: null, gender: 'Male' });
      prisma.notification.create.mockResolvedValue({});
      const req = {};
      const res = { locals: { user: { id: 'otherUser' } } };
      await ScheduleService.reschedule('schedule1', futureDate, req, res, false);
      // Cek description untuk tutor mengandung 'Pak Udin'
      expect(prisma.notification.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          description: expect.stringContaining('Pak Udin')
        })
      }));
    });
  });

  describe('updateScheduleInformation', () => {
    it('throws if information is not provided', async () => {
      await expect(ScheduleService.updateScheduleInformation('schedule1', undefined)).rejects.toThrow('Invalid information provided');
    });

    it('throws if information is not a string', async () => {
      await expect(ScheduleService.updateScheduleInformation('schedule1', 123)).rejects.toThrow('Invalid information provided');
    });

    it('throws if schedule not found', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce(null);
      await expect(ScheduleService.updateScheduleInformation('schedule1', 'Info baru')).rejects.toThrow('Schedule not found');
    });

    it('updates schedule information successfully', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce({ id: 'schedule1' });
      prisma.schedule.update.mockResolvedValueOnce({ id: 'schedule1', information: 'Info baru' });
      const result = await ScheduleService.updateScheduleInformation('schedule1', 'Info baru');
      expect(result).toMatchObject({ id: 'schedule1', information: 'Info baru' });
    });
  });

  describe('getNextDate', () => {
    it('returns the same date if currentDate is already the target day', () => {
      const monday = new Date('2025-07-07T00:00:00.000Z'); 
      const result = ScheduleService.getNextDate(monday, 1);
      expect(result.getDay()).toBe(1);
      expect(result.getDate()).toBe(monday.getDate());
    });

    it('returns the next correct date if currentDate is not the target day', () => {
      const sunday = new Date('2025-07-06T00:00:00.000Z'); 
      const result = ScheduleService.getNextDate(sunday, 1);
      expect(result.getDay()).toBe(1);
      expect(result.getDate()).toBe(7); 
    });
  });

  describe('getTutorName', () => {
    it('returns null if tutor is undefined', () => {
      expect(ScheduleService.getTutorName(undefined)).toBeNull();
    });

    it('returns null if tutor.user is undefined', () => {
      expect(ScheduleService.getTutorName({ gender: 'Male' })).toBeNull();
    });

    it('returns name with Pak if gender is Male', () => {
      expect(ScheduleService.getTutorName({ gender: 'Male', user: { name: 'Udin' } })).toBe('Pak Udin');
    });

    it('returns name with Bu if gender is not Male', () => {
      expect(ScheduleService.getTutorName({ gender: 'Female', user: { name: 'Siti' } })).toBe('Bu Siti');
    });
  });
});