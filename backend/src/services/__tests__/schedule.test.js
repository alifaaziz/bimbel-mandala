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
  });
});