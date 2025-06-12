import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const scheduleMock = { id: 1, date: '2023-01-01', classId: 1 };
const schedulesMock = [
  { id: 1, date: '2023-01-01', classId: 1 },
  { id: 2, date: '2023-01-02', classId: 1 },
];

jest.unstable_mockModule('../../services/schedule.js', () => ({
  ScheduleService: {
    createSchedules: jest.fn(() => Promise.resolve(schedulesMock)),
    reschedule: jest.fn(() => Promise.resolve(scheduleMock)),
    getClosestSchedules: jest.fn(() => Promise.resolve(scheduleMock)),
    getSchedulesByRole: jest.fn(() => Promise.resolve(schedulesMock)),
    getScheduleBySlug: jest.fn(() => Promise.resolve(scheduleMock)),
    updateScheduleInformation: jest.fn(() => Promise.resolve(scheduleMock)),
  },
}));

const { ScheduleController } = await import('../../controllers/schedule.js');
const { ScheduleService } = await import('../../services/schedule.js');

describe('ScheduleController', () => {
  describe('createSchedules', () => {
    it('should create schedules for a class and return 201', async () => {
      const { req, res } = setupExpressMock({
        req: { body: { classId: 1 } },
      });

      await ScheduleController.createSchedules(req, res);

      expect(ScheduleService.createSchedules).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: schedulesMock });
    });
  });

  describe('reschedule', () => {
    it('should reschedule a specific schedule and return 200', async () => {
      const { req, res } = setupExpressMock({
        req: { params: { id: 1 }, body: { newDate: '2023-01-10' } },
        res: { locals: { user: { role: 'admin' } } },
      });

      await ScheduleController.reschedule(req, res);

      expect(ScheduleService.reschedule).toHaveBeenCalledWith(1, '2023-01-10', req, res, true);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: scheduleMock });
    });
  });

  describe('getClosestSchedules', () => {
    it('should return the closest schedule for a class and return 200', async () => {
      const { req, res } = setupExpressMock({
        req: { params: { classId: 1 } },
      });

      await ScheduleController.getClosestSchedules(req, res);

      expect(ScheduleService.getClosestSchedules).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: scheduleMock });
    });
  });

  describe('getSchedules', () => {
    it('should return schedules for the logged-in user and return 200', async () => {
      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 123 } } },
      });

      await ScheduleController.getSchedules(req, res);

      expect(ScheduleService.getSchedulesByRole).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: schedulesMock });
    });
  });

  describe('getScheduleBySlug', () => {
    it('should return schedule detail by slug and return 200', async () => {
      const { req, res } = setupExpressMock({
        req: { params: { slug: 'schedule-1' } },
      });

      await ScheduleController.getScheduleBySlug(req, res);

      expect(ScheduleService.getScheduleBySlug).toHaveBeenCalledWith('schedule-1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: scheduleMock });
    });
  });

  describe('updateScheduleInformation', () => {
    it('should update schedule information and return 200', async () => {
      const { req, res } = setupExpressMock({
        req: { params: { id: 1 }, body: { information: 'Updated info' } },
      });

      await ScheduleController.updateScheduleInformation(req, res);

      expect(ScheduleService.updateScheduleInformation).toHaveBeenCalledWith(1, 'Updated info');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: scheduleMock });
    });
  });
});