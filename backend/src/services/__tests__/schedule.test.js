import { jest } from '@jest/globals';
import { setupExpressMock, generatePrismaMock } from '../../utils/jest.js';

const { prisma } = generatePrismaMock();

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma,
}));

const { ScheduleService } = await import('../schedule.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ScheduleService', () => {
  describe('getNextDate', () => {
    it('returns correct next date for given day index', () => {
      const today = new Date('2025-06-13');
      const dayIndex = 1;
      const next = ScheduleService.getNextDate(today, dayIndex);
      expect(next.getDay()).toBe(1); 
      expect(next.getTime()).toBeGreaterThan(today.getTime());
    });
  });

  describe('getTutorName', () => {
    it('returns correct name with prefix for Male', () => {
      const result = ScheduleService.getTutorName({
        gender: 'Male',
        user: { name: 'Udin' }
      });
      expect(result).toBe('Pak Udin');
    });

    it('returns correct name with prefix for Female', () => {
      const result = ScheduleService.getTutorName({
        gender: 'Female',
        user: { name: 'Siti' }
      });
      expect(result).toBe('Bu Siti');
    });

    it('returns null if invalid tutor object', () => {
      expect(ScheduleService.getTutorName(null)).toBeNull();
      expect(ScheduleService.getTutorName({})).toBeNull();
    });
  });

  describe('createSchedules', () => {
    it('throws error when class not found', async () => {
      prisma.class.findUnique.mockResolvedValueOnce(null);
      await expect(ScheduleService.createSchedules('nonexistent-class')).rejects.toThrow('Class not found');
    });

    it('throws error when totalMeetings is invalid', async () => {
      prisma.class.findUnique.mockResolvedValueOnce({
        order: {
          bimbelPackage: {
            totalMeetings: 0,
            time: '10:00',
            name: 'Matematika',
            level: 'Dasar',
            packageDay: []
          }
        }
      });
      await expect(ScheduleService.createSchedules('class1')).rejects.toThrow('Invalid totalMeetings in bimbelPackage');
    });

    it('throws error when time is invalid', async () => {
      prisma.class.findUnique.mockResolvedValueOnce({
        code: 'CLS123',
        order: {
          bimbelPackage: {
            totalMeetings: 3,
            time: 'invalid-time',
            name: 'IPA',
            level: 'Lanjutan',
            packageDay: []
          }
        }
      });
      await expect(ScheduleService.createSchedules('class1')).rejects.toThrow('Invalid time format in bimbelPackage');
    });

    it('generates unique slugs if collision occurs', async () => {
      const mathRandomSpy = jest.spyOn(Math, 'random');
      mathRandomSpy
      .mockReturnValueOnce(0.111111) // first slug
      .mockReturnValueOnce(0.222222); // second slug

      const now = new Date();
      const classId = 'class2';
      const classData = {
      code: 'CLS456',
      order: {
        bimbelPackage: {
        totalMeetings: 1,
        time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0).toISOString(),
        name: 'IPA',
        level: 'Lanjutan',
        packageDay: [
          { day: { daysName: 'Selasa' } }
        ]
        }
      }
      };

      prisma.class.findUnique.mockResolvedValueOnce(classData);
      // First slug is taken, second is available
      prisma.schedule.findUnique
      .mockResolvedValueOnce({ slug: 'ipa-lanjutan-cls456-aaaaaa' }) // collision
      .mockResolvedValueOnce(null); // unique

      prisma.schedule.createMany.mockResolvedValue({ count: 1 });
      const fakeSchedules = [
      {
        id: 'schedule3',
        classId,
        date: expect.any(Date),
        meet: 1,
        status: 'terjadwal',
        slug: expect.any(String),
      }
      ];
      prisma.schedule.findMany.mockResolvedValueOnce(fakeSchedules);

      const result = await ScheduleService.createSchedules(classId);

      expect(prisma.schedule.findUnique).toHaveBeenCalledTimes(3);
      expect(prisma.schedule.createMany).toHaveBeenCalledWith({
      data: expect.any(Array)
      });
      expect(result).toEqual(fakeSchedules);

      mathRandomSpy.mockRestore();
    });
  });

  describe('reschedule', () => {
    it('throws error when new date is invalid', async () => {
      await expect(ScheduleService.reschedule('schedule1', 'invalid-date')).rejects.toThrow('Invalid new date format');
    });

    it('throws error when new date is in the past', async () => {
      const pastDate = new Date('2020-01-01');
      await expect(ScheduleService.reschedule('schedule1', pastDate)).rejects.toThrow('New date cannot be in the past');
    });

    it('throws error when schedule is not found', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce(null);
      await expect(ScheduleService.reschedule('nonexistent-schedule', new Date())).rejects.toThrow('Schedule not found');
    });

    it('throws error when reschedule is attempted more than once', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce({ status: 'jadwal_ulang' });
      await expect(ScheduleService.reschedule('schedule1', new Date())).rejects.toThrow('Reschedule can only be done once');
    });

    it('throws error when attendance status is "masuk"', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce({
      status: 'terjadwal',
      attendances: [{ status: 'masuk' }]
      });
      await expect(ScheduleService.reschedule('schedule1', new Date())).rejects.toThrow('Cannot reschedule after attendance has been recorded');
    });

    it('throws error when attendance status is "izin"', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce({
      status: 'terjadwal',
      attendances: [{ status: 'izin' }]
      });
      await expect(ScheduleService.reschedule('schedule1', new Date())).rejects.toThrow('Cannot reschedule after attendance has been recorded');
    });

    it('reschedules successfully and creates notifications (non-admin)', async () => {
      const scheduleId = 'schedule1';
      const newDate = new Date(Date.now() + 1000000);
      const schedule = {
      status: 'terjadwal',
      attendances: [],
      class: {
        code: 'CLS123',
        order: {
        bimbelPackage: {
          userId: 'tutor1',
          name: 'Matematika',
          level: 'Dasar'
        },
        user: { id: 'student1' }
        }
      }
      };
      const tutor = {
      userId: 'tutor1',
      user: { name: 'Udin' },
      photo: 'photo-url'
      };
      const updatedSchedule = { id: scheduleId, date: newDate, status: 'jadwal_ulang' };
      const req = {};
      const res = { locals: { user: { id: 'admin2' } } };

      prisma.schedule.findUnique.mockResolvedValueOnce(schedule);
      prisma.schedule.update.mockResolvedValueOnce(updatedSchedule);
      prisma.tutor.findUnique.mockResolvedValueOnce(tutor);
      prisma.notification.create.mockResolvedValue({});
      // student notification
      // tutor notification

      const result = await ScheduleService.reschedule(scheduleId, newDate, req, res, false);

      expect(prisma.schedule.update).toHaveBeenCalledWith({
      where: { id: scheduleId },
      data: { date: newDate, status: 'jadwal_ulang' }
      });
      expect(prisma.notification.create).toHaveBeenCalledTimes(2);
      expect(result).toEqual(updatedSchedule);
    });

    it('reschedules successfully and creates notifications (admin)', async () => {
      const scheduleId = 'schedule2';
      const newDate = new Date(Date.now() + 1000000);
      const schedule = {
      status: 'terjadwal',
      attendances: [],
      class: {
        code: 'CLS456',
        order: {
        bimbelPackage: {
          userId: 'tutor2',
          name: 'IPA',
          level: 'Lanjutan'
        },
        user: { id: 'student2' }
        }
      }
      };
      const tutor = {
      userId: 'tutor2',
      user: { name: 'Siti' },
      photo: 'photo-url'
      };
      const updatedSchedule = { id: scheduleId, date: newDate, status: 'jadwal_ulang' };
      const req = {};
      const res = { locals: { user: { id: 'admin1' } } };

      prisma.schedule.findUnique.mockResolvedValueOnce(schedule);
      prisma.schedule.update.mockResolvedValueOnce(updatedSchedule);
      prisma.tutor.findUnique.mockResolvedValueOnce(tutor);
      prisma.notification.create.mockResolvedValue({});

      const result = await ScheduleService.reschedule(scheduleId, newDate, req, res, true);

      expect(prisma.schedule.update).toHaveBeenCalledWith({
      where: { id: scheduleId },
      data: { date: newDate, status: 'jadwal_ulang' }
      });
      expect(prisma.notification.create).toHaveBeenCalledTimes(2);
      expect(result).toEqual(updatedSchedule);
    });

    it('uses "Anda" as actorForTutor if logged in user is the tutor', async () => {
      const scheduleId = 'schedule3';
      const newDate = new Date(Date.now() + 1000000);
      const schedule = {
      status: 'terjadwal',
      attendances: [],
      class: {
        code: 'CLS789',
        order: {
        bimbelPackage: {
          userId: 'tutor3',
          name: 'Bahasa',
          level: 'Menengah'
        },
        user: { id: 'student3' }
        }
      }
      };
      const tutor = {
      userId: 'tutor3',
      user: { name: 'Budi' },
      photo: 'photo-url'
      };
      const updatedSchedule = { id: scheduleId, date: newDate, status: 'jadwal_ulang' };
      const req = {};
      const res = { locals: { user: { id: 'tutor3' } } };

      prisma.schedule.findUnique.mockResolvedValueOnce(schedule);
      prisma.schedule.update.mockResolvedValueOnce(updatedSchedule);
      prisma.tutor.findUnique.mockResolvedValueOnce(tutor);
      prisma.notification.create.mockResolvedValue({});

      await ScheduleService.reschedule(scheduleId, newDate, req, res, false);

      // Check that notification.create was called with "Anda" in the description for tutor
      const tutorNotifCall = prisma.notification.create.mock.calls[1][0];
      expect(tutorNotifCall.data.description).toContain('<strong>Anda</strong>');
    });
  });

  describe('updateScheduleInformation', () => {
    it('throws error when information is invalid', async () => {
      await expect(ScheduleService.updateScheduleInformation('schedule1', null)).rejects.toThrow('Invalid information provided');
    });

    it('throws error when schedule is not found', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce(null);
      await expect(ScheduleService.updateScheduleInformation('nonexistent-schedule', 'New Info')).rejects.toThrow('Schedule not found');
    });

    it('updates schedule information successfully', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce({ id: 'schedule1' });
      prisma.schedule.update.mockResolvedValueOnce({ id: 'schedule1', information: 'Updated Info' });

      const result = await ScheduleService.updateScheduleInformation('schedule1', 'Updated Info');
      expect(result).toEqual({ id: 'schedule1', information: 'Updated Info' });
    });
  });

  describe('getClosestSchedules', () => {
    it('throws error when no schedules are found', async () => {
      prisma.schedule.findMany.mockResolvedValueOnce([]);
      await expect(ScheduleService.getClosestSchedules()).rejects.toThrow('No schedules found');
    });

    it('returns closest schedules successfully', async () => {
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          date: new Date(),
          class: { code: 'CLS123', tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] } },
          meet: 1,
          status: 'terjadwal',
          slug: 'schedule-slug',
        },
      ]);

      const result = await ScheduleService.getClosestSchedules();
      expect(result).toEqual([
        {
          id: 'schedule1',
          classCode: 'CLS123',
          packageName: null,
          tutorName: 'Pak Tutor A',
          groupType: null,
          meet: 1,
          date: expect.any(Date),
          duration: null,
          status: 'terjadwal',
          slug: 'schedule-slug',
        },
      ]);
    });
  });

  describe('getSchedulesForStudent', () => {
    it('throws error when no classes are found for the student', async () => {
      prisma.studentClass.findMany.mockResolvedValueOnce([]);
      await expect(ScheduleService.getSchedulesForStudent('student1')).rejects.toThrow('No classes found for this student');
    });

    it('returns schedules for the student successfully', async () => {
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          date: new Date(),
          class: { code: 'CLS123', tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] } },
          meet: 1,
          status: 'terjadwal',
          slug: 'schedule-slug',
        },
      ]);

      const result = await ScheduleService.getSchedulesForStudent('student1');
      expect(result).toEqual([
        {
          id: 'schedule1',
          classCode: 'CLS123',
          packageName: null,
          level: null,
          tutorName: 'Pak Tutor A',
          groupType: null,
          meet: 1,
          date: expect.any(Date),
          duration: null,
          address: null,
          info: null,
          status: 'terjadwal',
          photo: null,
          slug: 'schedule-slug',
        },
      ]);
    });

    it('throws error when no schedules are found for the student (empty array)', async () => {
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([]);
      await expect(ScheduleService.getSchedulesForStudent('student1')).rejects.toThrow('No schedules found for this student');
    });

    it('throws error when no schedules are found for the student (undefined)', async () => {
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce(undefined);
      await expect(ScheduleService.getSchedulesForStudent('student1')).rejects.toThrow('No schedules found for this student');
    });

    it('sorts schedules so that future schedules come first, then by date ascending', async () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 1000000);
      const pastDate = new Date(now.getTime() - 1000000);

      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          date: pastDate,
          class: { code: 'CLS123', tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] } },
          meet: 1,
          status: 'terjadwal',
          slug: 'schedule-slug-1',
        },
        {
          id: 'schedule2',
          date: futureDate,
          class: { code: 'CLS124', tutor: { name: 'Tutor B', tutors: [{ gender: 'Female' }] } },
          meet: 2,
          status: 'terjadwal',
          slug: 'schedule-slug-2',
        },
        {
          id: 'schedule3',
          date: now,
          class: { code: 'CLS125', tutor: { name: 'Tutor C', tutors: [{ gender: 'Male' }] } },
          meet: 3,
          status: 'terjadwal',
          slug: 'schedule-slug-3',
        },
      ]);

      const result = await ScheduleService.getSchedulesForStudent('student1');
      // Expect future schedules (now and futureDate) first, sorted by date ascending, then pastDate
      expect(result.map(s => s.id)).toEqual(['schedule3', 'schedule2', 'schedule1']);
    });
  });

  describe('getSchedulesForTutor', () => {
    it('throws error when no schedules are found for the tutor', async () => {
      prisma.schedule.findMany.mockResolvedValueOnce([]);
      await expect(ScheduleService.getSchedulesForTutor('tutor1')).rejects.toThrow('No schedules found for this tutor');
    });

    it('returns schedules for the tutor successfully', async () => {
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          date: new Date(),
          class: { code: 'CLS123', tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] } },
          meet: 1,
          status: 'terjadwal',
          slug: 'schedule-slug',
        },
      ]);

      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      expect(result).toEqual([
        {
          id: 'schedule1',
          classCode: 'CLS123',
          packageName: null,
          level: null,
          tutorName: 'Pak Tutor A',
          groupType: null,
          meet: 1,
          date: expect.any(Date),
          duration: null,
          address: null,
          info: null,
          status: 'terjadwal',
          photo: null,
          slug: 'schedule-slug',
        },
      ]);
    });

    it('sorts schedules so that future schedules come first, then by date ascending (for tutor)', async () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 1000000);
      const pastDate = new Date(now.getTime() - 1000000);

      prisma.schedule.findMany.mockResolvedValueOnce([
      {
        id: 'schedule1',
        date: pastDate,
        class: { code: 'CLS123', tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }, status: 'aktif' },
        meet: 1,
        status: 'terjadwal',
        slug: 'schedule-slug-1',
      },
      {
        id: 'schedule2',
        date: futureDate,
        class: { code: 'CLS124', tutor: { name: 'Tutor B', tutors: [{ gender: 'Female' }] }, status: 'aktif' },
        meet: 2,
        status: 'terjadwal',
        slug: 'schedule-slug-2',
      },
      {
        id: 'schedule3',
        date: now,
        class: { code: 'CLS125', tutor: { name: 'Tutor C', tutors: [{ gender: 'Male' }] }, status: 'aktif' },
        meet: 3,
        status: 'terjadwal',
        slug: 'schedule-slug-3',
      },
      ]);

      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      // Expect future schedules (now and futureDate) first, sorted by date ascending, then pastDate
      expect(result.map(s => s.id)).toEqual(['schedule3', 'schedule2', 'schedule1']);
    });

    it('filters out schedules where class status is "selesai" (for tutor)', async () => {
      prisma.schedule.findMany.mockResolvedValueOnce([
      {
        id: 'schedule1',
        date: new Date(),
        class: { code: 'CLS123', tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }, status: 'selesai' },
        meet: 1,
        status: 'terjadwal',
        slug: 'schedule-slug-1',
      },
      {
        id: 'schedule2',
        date: new Date(),
        class: { code: 'CLS124', tutor: { name: 'Tutor B', tutors: [{ gender: 'Female' }] }, status: 'aktif' },
        meet: 2,
        status: 'terjadwal',
        slug: 'schedule-slug-2',
      },
      ]);

      const result = await ScheduleService.getSchedulesForTutor('tutor1');
      expect(result.map(s => s.id)).toEqual(['schedule2']);
    });

    it('filters out schedules where class status is "selesai" (for student)', async () => {
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }, { classId: 'class2' }]);
      prisma.schedule.findMany.mockResolvedValueOnce([
      {
        id: 'schedule1',
        date: new Date(),
        class: { code: 'CLS123', tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] }, status: 'selesai' },
        meet: 1,
        status: 'terjadwal',
        slug: 'schedule-slug-1',
      },
      {
        id: 'schedule2',
        date: new Date(),
        class: { code: 'CLS124', tutor: { name: 'Tutor B', tutors: [{ gender: 'Female' }] }, status: 'aktif' },
        meet: 2,
        status: 'terjadwal',
        slug: 'schedule-slug-2',
      },
      ]);

      const result = await ScheduleService.getSchedulesForStudent('student1');
      expect(result.map(s => s.id)).toEqual(['schedule2']);
    });
  });

  describe('getSchedulesByRole', () => {
    it('throws error when user is not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(ScheduleService.getSchedulesByRole('user1')).rejects.toThrow('User not found');
    });

    it('calls getSchedulesForStudent if user is siswa', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ role: 'siswa' });
      prisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'class1' }]); // Mock student classes
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          date: new Date(),
          class: { code: 'CLS123', tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] } },
          meet: 1,
          status: 'terjadwal',
          slug: 'schedule-slug',
        },
      ]);

      const result = await ScheduleService.getSchedulesByRole('student1');
      expect(result).toEqual([
        {
          id: 'schedule1',
          classCode: 'CLS123',
          packageName: null,
          level: null,
          tutorName: 'Pak Tutor A',
          groupType: null,
          meet: 1,
          date: expect.any(Date),
          duration: null,
          address: null,
          info: null,
          status: 'terjadwal',
          photo: null,
          slug: 'schedule-slug',
        },
      ]);
    });

    it('calls getSchedulesForTutor if user is tutor', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ role: 'tutor' });
      prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule2',
          date: new Date(),
          class: { code: 'CLS124', tutor: { name: 'Tutor B', tutors: [{ gender: 'Female' }] } },
          meet: 2,
          status: 'terjadwal',
          slug: 'schedule-slug-2',
        },
      ]);

      const result = await ScheduleService.getSchedulesByRole('tutor1');
      expect(result).toEqual([
        {
          id: 'schedule2',
          classCode: 'CLS124',
          packageName: null,
          level: null,
          tutorName: 'Bu Tutor B',
          groupType: null,
          meet: 2,
          date: expect.any(Date),
          duration: null,
          address: null,
          info: null,
          status: 'terjadwal',
          photo: null,
          slug: 'schedule-slug-2',
        },
      ]);
    });
  });

  describe('getScheduleBySlug', () => {
    it('throws error when schedule is not found', async () => {
      prisma.schedule.findUnique.mockResolvedValueOnce(null);
      await expect(ScheduleService.getScheduleBySlug('not-found-slug')).rejects.toThrow('Schedule not found');
    });

    it('returns schedule detail with all fields', async () => {
      const fakeSchedule = {
        id: 'schedule1',
        class: {
          code: 'CLS123',
          order: {
            bimbelPackage: {
              name: 'Matematika',
              level: 'Dasar',
              duration: 90,
              user: {},
              groupType: {},
            },
            groupType: {},
            address: 'Jl. Contoh',
          },
          tutor: {
            name: 'Udin',
            tutors: [{ gender: 'Male', photo: 'photo-url', phone: '081234', }],
            email: 'udin@email.com'
          }
        },
        meet: 1,
        date: new Date(),
        status: 'terjadwal',
        attendances: [{ id: 'att1' }],
        information: 'Info jadwal',
        slug: 'schedule-slug',
      };
      prisma.schedule.findUnique.mockResolvedValueOnce(fakeSchedule);

      const result = await ScheduleService.getScheduleBySlug('schedule-slug');
      expect(result).toEqual({
        id: 'schedule1',
        classCode: 'CLS123',
        packageName: 'Matematika',
        level: 'Dasar',
        tutorName: 'Pak Udin',
        groupType: null,
        meet: 1,
        date: expect.any(Date),
        duration: 90,
        status: 'terjadwal',
        attendances: [{ id: 'att1' }],
        address: 'Jl. Contoh',
        photo: 'photo-url',
        info: 'Info jadwal',
        tutorPhone: '081234',
        tutorEmail: 'udin@email.com',
        slug: 'schedule-slug',
      });
    });

    it('returns nulls for missing optional fields', async () => {
      const fakeSchedule = {
        id: 'schedule2',
        class: {
          code: 'CLS124',
          order: {
            bimbelPackage: {},
            groupType: {},
          },
          tutor: {
            name: 'Siti',
            tutors: [{ gender: 'Female' }],
            email: undefined,
          },
        },
        meet: 2,
        date: new Date(),
        status: 'terjadwal',
        attendances: [],
        information: null,
        slug: 'schedule-slug-2',
      };
      prisma.schedule.findUnique.mockResolvedValueOnce(fakeSchedule);

      const result = await ScheduleService.getScheduleBySlug('schedule-slug-2');
      expect(result).toEqual({
        id: 'schedule2',
        classCode: 'CLS124',
        packageName: null,
        level: null,
        tutorName: 'Bu Siti', // Updated expectation
        groupType: null,
        meet: 2,
        date: expect.any(Date),
        duration: null,
        status: 'terjadwal',
        attendances: [],
        address: null,
        photo: null,
        info: null,
        tutorPhone: undefined,
        tutorEmail: undefined,
        slug: 'schedule-slug-2',
      });
    });
  });
});