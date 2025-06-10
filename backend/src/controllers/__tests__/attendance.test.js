import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';
import { AttendanceController } from '../../controllers/attendance.js';
import { AttendanceService } from '../../services/attendance.js';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';

const attendanceMock = { id: 1, scheduleId: 10, userId: 123, status: 'masuk' };
const statsMock = { hadir: 10, izin: 2, alpha: 1 };
const rekapMock = {
  printDate: '16 Mei 2025',
  name: 'Bahasa Inggris',
  level: 'SMA',
  classCode: 'ABC123',
  tutorName: 'Venita S.Pd',
  tutorMasuk: 8,
  tutorIzin: 0,
  tutorAlpha: 0,
  students: [],
  pertemuan: 8,
  kosong: 0,
  progress: 100,
  absensi: 100,
};

// Mock AttendanceService
jest.mock('../../services/attendance.js', () => ({
  AttendanceService: {
    createAttendance: jest.fn(),
    markAlphaForMissedSchedules: jest.fn(),
    getAttendanceStatistics: jest.fn(),
    getMyAttendanceStatistics: jest.fn(),
    getRekapKelasById: jest.fn(),
    createMasukNotification: jest.fn(),
    createIzinNotification: jest.fn(),
  },
}));

// Mock Puppeteer
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      setContent: jest.fn(),
      pdf: jest.fn().mockResolvedValue(Buffer.from('PDF content')),
    }),
    close: jest.fn(),
  }),
}));

// Mock fs and path
jest.spyOn(fs, 'readFile').mockResolvedValue('<html>template</html>');
jest.spyOn(path, 'resolve').mockReturnValue('src/utils/emails/template/rekap.html');

// Mock Handlebars
jest.spyOn(Handlebars, 'compile').mockReturnValue(() => '<html>rendered</html>');

describe('AttendanceController', () => {
  describe('createAttendance', () => {
    it('should create attendance and return 201', async () => {
      AttendanceService.createAttendance.mockResolvedValue(attendanceMock);
      const { req, res } = setupExpressMock({
        req: {
          body: { scheduleId: 10, status: 'masuk' },
        },
        res: {
          locals: { user: { id: 123 } },
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        },
      });
      await AttendanceController.createAttendance(req, res);
      expect(AttendanceService.createAttendance).toHaveBeenCalledWith({
        scheduleId: 10,
        userId: 123,
        status: 'masuk',
      });
      expect(AttendanceService.createMasukNotification).toHaveBeenCalledWith({
        scheduleId: 10,
        userId: 123,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Attendance recorded successfully',
        data: attendanceMock,
      });
    });
  });

  describe('absenIzin', () => {
    it('should create izin attendance and return 201', async () => {
      AttendanceService.createAttendance.mockResolvedValue(attendanceMock);
      const { req, res } = setupExpressMock({
        req: {
          body: { scheduleId: 10, status: 'izin', reason: 'Sakit' },
        },
        res: {
          locals: { user: { id: 123 } },
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        },
      });
      await AttendanceController.absenIzin(req, res);
      expect(AttendanceService.createAttendance).toHaveBeenCalledWith({
        scheduleId: 10,
        userId: 123,
        status: 'izin',
        reason: 'Sakit',
      });
      expect(AttendanceService.createIzinNotification).toHaveBeenCalledWith({
        scheduleId: 10,
        userId: 123,
        reason: 'Sakit',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Attendance recorded successfully',
        data: attendanceMock,
      });
    });

    it('should return 400 if reason is missing', async () => {
      const { req, res } = setupExpressMock({
        req: {
          body: { scheduleId: 10, status: 'izin' },
        },
        res: {
          locals: { user: { id: 123 } },
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        },
      });
      await AttendanceController.absenIzin(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Reason is required for izin' });
    });
  });

  describe('markAlphaAttendance', () => {
    it('should mark alpha attendance for missed schedules', async () => {
      AttendanceService.markAlphaForMissedSchedules.mockResolvedValue();

      const { req, res } = setupExpressMock({
        res: {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        },
      });

      await AttendanceController.markAlphaAttendance(req, res);

      expect(AttendanceService.markAlphaForMissedSchedules).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Alpha attendance marked for missed schedules.' });
    });
  });

  describe('getAttendanceStatistics', () => {
    it('should return attendance statistics', async () => {
      AttendanceService.getAttendanceStatistics.mockResolvedValue(statsMock);

      const { req, res } = setupExpressMock({
        res: {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        },
      });

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
        res: {
          locals: { user: { id: 123, name: 'Test User' } },
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        },
      });

      await AttendanceController.getMyAttendanceStatistics(req, res);

      expect(AttendanceService.getMyAttendanceStatistics).toHaveBeenCalledWith({ id: 123, name: 'Test User' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(statsMock);
    });
  });

  describe('downloadRekapPDF', () => {
    it('should generate and send a PDF for class rekap', async () => {
      const classId = '123';
      const pdfBuffer = Buffer.from('PDF content');
      AttendanceService.getRekapKelasById.mockResolvedValue(rekapMock);

      const { req, res } = setupExpressMock({
        req: { params: { classId } },
        res: {
          setHeader: jest.fn(),
          end: jest.fn(),
        },
      });

      await AttendanceController.downloadRekapPDF(req, res);

      expect(AttendanceService.getRekapKelasById).toHaveBeenCalledWith(classId);
      expect(fs.readFile).toHaveBeenCalledWith('src/utils/emails/template/rekap.html', 'utf-8');
      expect(Handlebars.compile).toHaveBeenCalledWith('<html>template</html>');
      expect(puppeteer.launch).toHaveBeenCalledWith({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        `attachment; filename=rekap-${classId}.pdf`
      );
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(res.end).toHaveBeenCalledWith(pdfBuffer);
    });
  });
});