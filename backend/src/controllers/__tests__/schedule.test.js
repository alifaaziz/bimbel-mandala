import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const scheduleMock = { id: 1, date: '2025-07-07', slug: 'sch-1' };
const schedulesMock = [scheduleMock];

jest.unstable_mockModule('../../services/schedule.js', () => ({
  ScheduleService: {
    createSchedules: jest.fn(),
    reschedule: jest.fn(),
    getClosestSchedules: jest.fn(),
    getSchedulesByRole: jest.fn(),
    getScheduleBySlug: jest.fn(),
    updateScheduleInformation: jest.fn(),
    getClosestScheduleBySlug: jest.fn(),
  },
}));

const { ScheduleController } = await import('../../controllers/schedule.js');
const { ScheduleService } = await import('../../services/schedule.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ScheduleController', () => {
  describe('createSchedules', () => {
    it('should create schedules and return 201', async () => {
      ScheduleService.createSchedules.mockResolvedValue(schedulesMock);

      const { req, res } = setupExpressMock({
        req: { body: { classId: 123 } },
      });

      await ScheduleController.createSchedules(req, res);

      expect(ScheduleService.createSchedules).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: schedulesMock });
    });
  });

  describe('reschedule', () => {
    it('should reschedule as admin', async () => {
      ScheduleService.reschedule.mockResolvedValue(scheduleMock);

      const { req, res } = setupExpressMock({
        req: { params: { id: 1 }, body: { newDate: '2025-07-08' } },
      });
      res.locals.user = { id: 1, role: 'admin' };

      await ScheduleController.reschedule(req, res);

      expect(ScheduleService.reschedule).toHaveBeenCalledWith(
        1, '2025-07-08', req, res, true
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: scheduleMock });
    });

    it('should reschedule as non-admin', async () => {
      ScheduleService.reschedule.mockResolvedValue(scheduleMock);

      const { req, res } = setupExpressMock({
        req: { params: { id: 2 }, body: { newDate: '2025-07-09' } },
      });
      res.locals.user = { id: 2, role: 'student' };

      await ScheduleController.reschedule(req, res);

      expect(ScheduleService.reschedule).toHaveBeenCalledWith(
        2, '2025-07-09', req, res, false
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: scheduleMock });
    });
  });

  describe('getClosestSchedules', () => {
    it('should get closest schedules with query', async () => {
      ScheduleService.getClosestSchedules.mockResolvedValue(schedulesMock);

      const { req, res } = setupExpressMock({
        req: { query: { page: '2', limit: '3', search: 'FOKUS' } },
      });

      await ScheduleController.getClosestSchedules(req, res);

      expect(ScheduleService.getClosestSchedules).toHaveBeenCalledWith(2, 3, 'FOKUS');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: schedulesMock });
    });

    it('should get closest schedules with default pagination', async () => {
      ScheduleService.getClosestSchedules.mockResolvedValue(schedulesMock);

      const { req, res } = setupExpressMock({ req: { query: {} } });

      await ScheduleController.getClosestSchedules(req, res);

      expect(ScheduleService.getClosestSchedules).toHaveBeenCalledWith(1, 10, '');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: schedulesMock });
    });
  });

  describe('getSchedules', () => {
    it('should get schedules for user with query', async () => {
      ScheduleService.getSchedulesByRole.mockResolvedValue(schedulesMock);

      const { req, res } = setupExpressMock({
        req: { query: { page: '3', limit: '7' } },
      });
      res.locals.user = { id: 42 };

      await ScheduleController.getSchedules(req, res);

      expect(ScheduleService.getSchedulesByRole).toHaveBeenCalledWith(42, 3, 7);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: schedulesMock });
    });

    it('should get schedules for user with default pagination', async () => {
      ScheduleService.getSchedulesByRole.mockResolvedValue(schedulesMock);

      const { req, res } = setupExpressMock({ req: { query: {} } });
      res.locals.user = { id: 42 };

      await ScheduleController.getSchedules(req, res);

      expect(ScheduleService.getSchedulesByRole).toHaveBeenCalledWith(42, 1, 5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: schedulesMock });
    });
  });

  describe('getScheduleBySlug', () => {
    it('should get schedule by slug', async () => {
      ScheduleService.getScheduleBySlug.mockResolvedValue(scheduleMock);

      const { req, res } = setupExpressMock({ req: { params: { slug: 'sch-1' } } });

      await ScheduleController.getScheduleBySlug(req, res);

      expect(ScheduleService.getScheduleBySlug).toHaveBeenCalledWith('sch-1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: scheduleMock });
    });
  });

  describe('updateScheduleInformation', () => {
    it('should update schedule information', async () => {
      ScheduleService.updateScheduleInformation.mockResolvedValue(scheduleMock);

      const { req, res } = setupExpressMock({
        req: { params: { id: 1 }, body: { information: 'Info baru' } },
      });

      await ScheduleController.updateScheduleInformation(req, res);

      expect(ScheduleService.updateScheduleInformation).toHaveBeenCalledWith(1, 'Info baru');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: scheduleMock });
    });
  });

  describe('getClosestScheduleBySlug', () => {
    it('should get closest schedule by slug', async () => {
      ScheduleService.getClosestScheduleBySlug.mockResolvedValue(scheduleMock);

      const { req, res } = setupExpressMock({ req: { params: { slug: 'sch-1' } } });

      await ScheduleController.getClosestScheduleBySlug(req, res);

      expect(ScheduleService.getClosestScheduleBySlug).toHaveBeenCalledWith('sch-1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: scheduleMock });
    });
  });

  describe('getScheduleByUserId', () => {
    it('should get schedules by user id', async () => {
      ScheduleService.getSchedulesByRole.mockResolvedValue(schedulesMock);

      const { req, res } = setupExpressMock({ req: { params: { userId: 7 } } });

      await ScheduleController.getScheduleByUserId(req, res);

      expect(ScheduleService.getSchedulesByRole).toHaveBeenCalledWith(7, 1, 5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: schedulesMock });
    });
  });
});