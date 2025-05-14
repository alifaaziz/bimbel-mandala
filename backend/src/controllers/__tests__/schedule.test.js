import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const schedulesMock = [{ id: 1, classId: 2, date: '2024-06-01' }];
const scheduleMock = { id: 1, classId: 2, date: '2024-06-01' };
const updatedScheduleMock = { id: 1, classId: 2, date: '2024-07-01' };

jest.unstable_mockModule('../../services/schedule.js', () => ({
  ScheduleService: {
    createSchedules: jest.fn(() => Promise.resolve(schedulesMock)),
    reschedule: jest.fn(() => Promise.resolve(updatedScheduleMock)),
    getClosestSchedules: jest.fn(() => Promise.resolve(scheduleMock)),
    getSchedulesByRole: jest.fn(() => Promise.resolve(schedulesMock)),
  },
}));

const { ScheduleController } = await import('../../controllers/schedule.js');
const { ScheduleService } = await import('../../services/schedule.js');

describe('ScheduleController', () => {
  describe('createSchedules', () => {
    it('should create schedules and return 201', async () => {
      ScheduleService.createSchedules.mockResolvedValue(schedulesMock);

      const { req, res } = setupExpressMock({
        req: { body: { classId: 2 } },
      });

      await ScheduleController.createSchedules(req, res);

      expect(ScheduleService.createSchedules).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: schedulesMock });
    });
  });

  describe('reschedule', () => {
    it('should reschedule and return 200', async () => {
      ScheduleService.reschedule.mockResolvedValue(updatedScheduleMock);

      const { req, res } = setupExpressMock({
        req: { params: { id: 1 }, body: { newDate: '2024-07-01' } },
        res: { locals: { user: { id: 10, role: 'admin' } } },
      });

      await ScheduleController.reschedule(req, res);

      expect(ScheduleService.reschedule).toHaveBeenCalledWith(
        1,
        '2024-07-01',
        req,
        res,
        true
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: updatedScheduleMock });
    });
  });

  describe('getClosestSchedules', () => {
    it('should get closest schedule and return 200', async () => {
      ScheduleService.getClosestSchedules.mockResolvedValue(scheduleMock);

      const { req, res } = setupExpressMock({
        req: { params: { classId: 2 } },
      });

      await ScheduleController.getClosestSchedules(req, res);

      expect(ScheduleService.getClosestSchedules).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: scheduleMock });
    });
  });

  describe('getSchedules', () => {
    it('should get schedules for user and return 200', async () => {
      ScheduleService.getSchedulesByRole.mockResolvedValue(schedulesMock);

      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 10 } } },
      });

      await ScheduleController.getSchedules(req, res);

      expect(ScheduleService.getSchedulesByRole).toHaveBeenCalledWith(10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: schedulesMock });
    });
  });
});