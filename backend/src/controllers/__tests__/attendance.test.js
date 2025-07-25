import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

jest.unstable_mockModule('../../services/attendance.js', () => ({
  AttendanceService: {
    createAttendance: jest.fn(),
    createMasukNotification: jest.fn(),
    createIzinNotification: jest.fn(),
    markAlphaForMissedSchedules: jest.fn(),
    getAttendanceStatistics: jest.fn(),
    getMyAttendanceStatistics: jest.fn(),
    getRekapKelasById: jest.fn(),
    alertAttendance: jest.fn(),
  },
}));

const { AttendanceController } = await import('../attendance.js');
const { AttendanceService } = await import('../../services/attendance.js');

jest.setTimeout(10000);

describe('AttendanceController', () => {
  describe('absenMasuk', () => {
    it('should record attendance with status "masuk"', async () => {
      const mockResponse = {
        id: 'scheduleAttendance1',
        scheduleId: 'schedule1',
        userId: 'user1',
        status: 'masuk',
        reason: null,
      };

      AttendanceService.createAttendance.mockResolvedValue(mockResponse);
      AttendanceService.createMasukNotification.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { body: { scheduleId: 'schedule1' } },
        res: { locals: { user: { id: 'user1' } } },
      });

      await AttendanceController.absenMasuk(req, res);

      expect(AttendanceService.createAttendance).toHaveBeenCalledWith({
        scheduleId: 'schedule1',
        userId: 'user1',
        status: 'masuk',
      });

      expect(AttendanceService.createMasukNotification).toHaveBeenCalledWith({
        scheduleId: 'schedule1',
        userId: 'user1',
      });
    });
  });

  describe('absenIzin', () => {
    it('should record attendance with status "izin"', async () => {
      const mockResponse = {
        id: 'scheduleAttendance1',
        scheduleId: 'schedule1',
        userId: 'user1',
        status: 'izin',
        reason: 'Sick',
      };

      AttendanceService.createAttendance.mockResolvedValue(mockResponse);
      AttendanceService.createIzinNotification.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { body: { scheduleId: 'schedule1', reason: 'Sick' } },
        res: { locals: { user: { id: 'user1' } } },
      });

      await AttendanceController.absenIzin(req, res);

      expect(AttendanceService.createAttendance).toHaveBeenCalledWith({
        scheduleId: 'schedule1',
        userId: 'user1',
        status: 'izin',
        reason: 'Sick',
      });
      expect(AttendanceService.createIzinNotification).toHaveBeenCalledWith({
        scheduleId: 'schedule1',
        userId: 'user1',
        reason: 'Sick',
      });
    });

    it('should return 400 if reason is not provided', async () => {
      const { req, res } = setupExpressMock({
        req: { body: { scheduleId: 'schedule1' } },
        res: { locals: { user: { id: 'user1' } } },
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
      expect(res.json).toHaveBeenCalledWith({
        message: 'Alpha attendance marked for missed schedules.',
      });
    });
  });

  describe('getAttendanceStatistics', () => {
    it('should return attendance statistics for a class', async () => {
      const statsMock = [{ classId: 'class1', attendance: 'statistics' }];
      AttendanceService.getRekapKelasById.mockResolvedValue(statsMock);

      const { req, res } = setupExpressMock({
        req: { params: { classId: 'class1' } },
      });

      await AttendanceController.getAttendanceStatistics(req, res);

      expect(AttendanceService.getRekapKelasById).toHaveBeenCalledWith('class1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: statsMock,
      });
    });
  });

  describe('getMyAttendanceStatistics', () => {
    it('should return attendance statistics for the logged-in user', async () => {
      const statsMock = { userId: 'user1', attendance: 'statistics' };
      AttendanceService.getMyAttendanceStatistics.mockResolvedValue(statsMock);

      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 'user1' } } },
      });

      await AttendanceController.getMyAttendanceStatistics(req, res);

      expect(AttendanceService.getMyAttendanceStatistics).toHaveBeenCalledWith({ id: 'user1' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(statsMock);
    });
  });

  describe('getAttendanceAlerts', () => {
    it('should return attendance alerts for a class', async () => {
      const alertsMock = [
        { tanggal: '2025-07-13', meet: 2, waktuAbsen: '21.09', status: 'Potensi Terlambat', keterangan: 'Tutor terlambat 6 menit' }
      ];
      AttendanceService.alertAttendance.mockResolvedValue(alertsMock);

      const { req, res } = setupExpressMock({
        req: { params: { classId: 'class1' } },
      });

      await AttendanceController.getAttendanceAlerts(req, res);

      expect(AttendanceService.alertAttendance).toHaveBeenCalledWith('class1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: alertsMock });
    });
  });
});