import { jest } from '@jest/globals';
import { generatePrismaMock } from '../../utils/jest.js';

const mockPrisma = generatePrismaMock();

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: mockPrisma.prisma,
}));

const { ScheduleService } = await import('../schedule.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ScheduleService', () => {
  describe('createSchedules', () => {
    it('should create schedules for a class', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce({
        id: 'class1',
        code: 'CLS1',
        order: {
          bimbelPackage: {
            name: 'Math Package',
            level: 'SMA',
            totalMeetings: 2,
            time: '10:00',
            packageDay: [{ day: { daysName: 'Senin' } }],
          },
        },
      });
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce(null);
      mockPrisma.prisma.schedule.createMany.mockResolvedValueOnce({});
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
        { id: 'schedule1', date: '2023-01-01', classId: 'class1' },
      ]);

      const result = await ScheduleService.createSchedules('class1');

      expect(mockPrisma.prisma.class.findUnique).toHaveBeenCalledWith({
        where: { id: 'class1' },
        include: {
          order: {
            include: {
              bimbelPackage: {
                include: {
                  packageDay: { include: { day: true } },
                },
              },
            },
          },
        },
      });
      expect(mockPrisma.prisma.schedule.createMany).toHaveBeenCalled();
      expect(result).toEqual([{ id: 'schedule1', date: '2023-01-01', classId: 'class1' }]);
    });

    it('should throw an error if class is not found', async () => {
      mockPrisma.prisma.class.findUnique.mockResolvedValueOnce(null);

      await expect(ScheduleService.createSchedules('class1')).rejects.toThrow('Class not found');
    });
  });

  describe('reschedule', () => {
    it('should reschedule a specific schedule', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule1',
        status: 'terjadwal',
        attendances: [],
        class: {
          code: 'CLS1',
          order: {
            bimbelPackage: { name: 'Math Package', level: 'SMA' },
            user: { id: 'student1' },
          },
        },
      });
      mockPrisma.prisma.schedule.update.mockResolvedValueOnce({ id: 'schedule1', date: '2023-01-10' });
      mockPrisma.prisma.notification.create.mockResolvedValueOnce({});

      const result = await ScheduleService.reschedule('schedule1', '2023-01-10', {}, { locals: { user: { id: 'admin' } } }, true);

      expect(mockPrisma.prisma.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: 'schedule1' },
        include: {
          attendances: true,
          class: {
            include: {
              order: { include: { bimbelPackage: true, user: true } },
            },
          },
        },
      });
      expect(mockPrisma.prisma.schedule.update).toHaveBeenCalledWith({
        where: { id: 'schedule1' },
        data: { date: new Date('2023-01-10'), status: 'jadwal_ulang' },
      });
      expect(result).toEqual({ id: 'schedule1', date: '2023-01-10' });
    });

    it('should throw an error if schedule is not found', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce(null);

      await expect(ScheduleService.reschedule('schedule1', '2023-01-10', {}, {}, true)).rejects.toThrow('Schedule not found');
    });
  });

  describe('updateScheduleInformation', () => {
    it('should update schedule information', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({ id: 'schedule1' });
      mockPrisma.prisma.schedule.update.mockResolvedValueOnce({ id: 'schedule1', information: 'Updated info' });

      const result = await ScheduleService.updateScheduleInformation('schedule1', 'Updated info');

      expect(mockPrisma.prisma.schedule.findUnique).toHaveBeenCalledWith({ where: { id: 'schedule1' } });
      expect(mockPrisma.prisma.schedule.update).toHaveBeenCalledWith({
        where: { id: 'schedule1' },
        data: { information: 'Updated info' },
      });
      expect(result).toEqual({ id: 'schedule1', information: 'Updated info' });
    });

    it('should throw an error if schedule is not found', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce(null);

      await expect(ScheduleService.updateScheduleInformation('schedule1', 'Updated info')).rejects.toThrow('Schedule not found');
    });
  });

  describe('getClosestSchedules', () => {
    it('should return the closest schedules', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([
        {
          id: 'schedule1',
          date: new Date(),
          class: {
            code: 'CLS1',
            order: { bimbelPackage: { name: 'Math Package', duration: 60 } },
            tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] },
          },
        },
      ]);

      const result = await ScheduleService.getClosestSchedules();

      expect(mockPrisma.prisma.schedule.findMany).toHaveBeenCalledWith({
        where: { date: { gte: expect.any(Date) } },
        include: {
          class: {
            include: {
              order: { include: { bimbelPackage: { include: { user: true, groupType: true } }, groupType: true } },
              tutor: { include: { tutors: true } },
            },
          },
        },
        orderBy: { date: 'asc' },
      });
      expect(result).toEqual([
        {
          id: 'schedule1',
          classCode: 'CLS1',
          packageName: 'Math Package',
          tutorName: 'Pak Tutor A',
          groupType: null,
          meet: undefined,
          date: expect.any(Date),
          duration: 60,
          status: undefined,
          slug: null,
        },
      ]);
    });

    it('should throw an error if no schedules are found', async () => {
      mockPrisma.prisma.schedule.findMany.mockResolvedValueOnce([]);

      await expect(ScheduleService.getClosestSchedules()).rejects.toThrow('No schedules found');
    });
  });

  describe('getSchedulesByRole', () => {
    it('should return schedules for a student', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ role: 'siswa' });
      jest.spyOn(ScheduleService, 'getSchedulesForStudent').mockResolvedValueOnce([{ id: 'schedule1' }]);

      const result = await ScheduleService.getSchedulesByRole('user1');

      expect(ScheduleService.getSchedulesForStudent).toHaveBeenCalledWith('user1');
      expect(result).toEqual([{ id: 'schedule1' }]);
    });

    it('should return schedules for a tutor', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ role: 'tutor' });
      jest.spyOn(ScheduleService, 'getSchedulesForTutor').mockResolvedValueOnce([{ id: 'schedule1' }]);

      const result = await ScheduleService.getSchedulesByRole('user1');

      expect(ScheduleService.getSchedulesForTutor).toHaveBeenCalledWith('user1');
      expect(result).toEqual([{ id: 'schedule1' }]);
    });

    it('should throw an error if user is not found', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(ScheduleService.getSchedulesByRole('user1')).rejects.toThrow('User not found');
    });
  });

  describe('getScheduleBySlug', () => {
    it('should return schedule detail by slug', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce({
        id: 'schedule1',
        class: {
          code: 'CLS1',
          order: { bimbelPackage: { name: 'Math Package', level: 'SMA' } },
          tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] },
        },
      });

      const result = await ScheduleService.getScheduleBySlug('slug1');

      expect(mockPrisma.prisma.schedule.findUnique).toHaveBeenCalledWith({
        where: { slug: 'slug1' },
        include: {
          class: {
            include: {
              order: { include: { bimbelPackage: { include: { user: true, groupType: true } }, groupType: true } },
              tutor: { include: { tutors: true } },
            },
          },
          attendances: true,
        },
      });
      expect(result).toEqual(expect.objectContaining({ id: 'schedule1', classCode: 'CLS1' }));
    });

    it('should throw an error if schedule is not found', async () => {
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce(null);

      await expect(ScheduleService.getScheduleBySlug('slug1')).rejects.toThrow('Schedule not found');
    });
  });
});