import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const attendanceMock = { id: 1, scheduleId: 10, userId: 123, status: 'masuk' };
const statsMock = { hadir: 10, izin: 2, alpha: 1 };

jest.unstable_mockModule('../../services/attendance.js', () => ({
  AttendanceService: {
    createAttendance: jest.fn(() => Promise.resolve(attendanceMock)),
    markAlphaForMissedSchedules: jest.fn(() => Promise.resolve()),
    getAttendanceStatistics: jest.fn(() => Promise.resolve(statsMock)),
    getMyAttendanceStatistics: jest.fn(() => Promise.resolve(statsMock)),
  },
}));

const { AttendanceController } = await import('../../controllers/attendance.js');
const { AttendanceService } = await import('../../services/attendance.js');

describe('AttendanceController', () => {
  describe('absenMasuk', () => {
    it('should create attendance with status "masuk"', async () => {
      AttendanceService.createAttendance.mockResolvedValue(attendanceMock);

      const { req, res } = setupExpressMock({
        req: { body: { scheduleId: 10 } },
        res: { locals: { user: { id: 123 } } },
      });

      await AttendanceController.absenMasuk(req, res);

      expect(AttendanceService.createAttendance).toHaveBeenCalledWith({
        scheduleId: 10,
        userId: 123,
        status: 'masuk',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Attendance recorded successfully',
        data: attendanceMock,
      });
    });
  });

  describe('absenIzin', () => {
    it('should create attendance with status "izin"', async () => {
      AttendanceService.createAttendance.mockResolvedValue({ ...attendanceMock, status: 'izin', reason: 'sakit' });

      const { req, res } = setupExpressMock({
        req: { body: { scheduleId: 10, reason: 'sakit' } },
        res: { locals: { user: { id: 123 } } },
      });

      await AttendanceController.absenIzin(req, res);

      expect(AttendanceService.createAttendance).toHaveBeenCalledWith({
        scheduleId: 10,
        userId: 123,
        status: 'izin',
        reason: 'sakit',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Attendance recorded successfully',
        data: { ...attendanceMock, status: 'izin', reason: 'sakit' },
      });
    });

    it('should return 400 if reason is missing', async () => {
      const { req, res } = setupExpressMock({
        req: { body: { scheduleId: 10 } },
        res: { locals: { user: { id: 123 } } },
      });

      await AttendanceController.absenIzin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reason is required for izin' });
    });
  });

  describe('markAlphaAttendance', () => {
    it('should mark alpha attendance for missed schedules', async () => {
      AttendanceService.markAlphaForMissedSchedules.mockResolvedValue();

      const { req, res } = setupExpressMock();

      await AttendanceController.markAlphaAttendance(req, res);

      expect(AttendanceService.markAlphaForMissedSchedules).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Alpha attendance marked for missed schedules.' });
    });
  });

  describe('getAttendanceStatistics', () => {
    it('should return attendance statistics', async () => {
      AttendanceService.getAttendanceStatistics.mockResolvedValue(statsMock);

      const { req, res } = setupExpressMock();

      await AttendanceController.getAttendanceStatistics(req, res);

      expect(AttendanceService.getAttendanceStatistics).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Attendance statistics retrieved successfully',
        data: statsMock,
      });
    });
  });

  describe('getMyAttendanceStatistics', () => {
    it('should return my attendance statistics', async () => {
      AttendanceService.getMyAttendanceStatistics.mockResolvedValue(statsMock);

      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 123, name: 'Test User' } } },
      });

      await AttendanceController.getMyAttendanceStatistics(req, res);

      expect(AttendanceService.getMyAttendanceStatistics).toHaveBeenCalledWith({ id: 123, name: 'Test User' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(statsMock);
    });
  });
});