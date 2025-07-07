import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const classMock = { id: 1, name: 'Math Class', code: 'ABC123' };
const classesMock = [
  { id: 1, name: 'Math Class', code: 'ABC123' },
  { id: 2, name: 'Science Class', code: 'XYZ456' },
];

jest.unstable_mockModule('../../services/class.js', () => ({
  ClassService: {
    createClass: jest.fn(() => Promise.resolve(classMock)),
    joinClass: jest.fn(() => Promise.resolve(classMock)),
    getMyClass: jest.fn(() => Promise.resolve(classesMock)),
    getRunningClass: jest.fn(() => Promise.resolve(classesMock)),
    getStudentClassesByUserId: jest.fn(() => Promise.resolve(classesMock)),
    getFinishedClasses: jest.fn(() => Promise.resolve(classesMock)),
  },
}));

const { ClassController } = await import('../../controllers/class.js');
const { ClassService } = await import('../../services/class.js');

describe('ClassController', () => {
  describe('createClass', () => {
    it('should create a new class and return 201', async () => {
      const { req, res } = setupExpressMock({
        req: { body: { name: 'Math Class', code: 'ABC123' } },
      });

      await ClassController.createClass(req, res);

      expect(ClassService.createClass).toHaveBeenCalledWith({ name: 'Math Class', code: 'ABC123' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: classMock });
    });
  });

  describe('joinClass', () => {
    it('should join a class using a code and return 200', async () => {
      const { req, res } = setupExpressMock({
        req: { body: { code: 'ABC123' } },
        res: { locals: { user: { id: 123 } } },
      });

      await ClassController.joinClass(req, res);

      expect(ClassService.joinClass).toHaveBeenCalledWith({ code: 'ABC123', userId: 123 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: classMock });
    });
  });

  describe('getMyClass', () => {
    it('should return user classes and return 200', async () => {
      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 123, role: 'student' } } },
      });

      await ClassController.getMyClass(req, res);

      expect(ClassService.getMyClass).toHaveBeenCalledWith(123, 'student');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: classesMock });
    });
  });

  describe('getRunningClass', () => {
    it('should return running classes and return 200', async () => {
      const runningClassesMock = [
        { id: 1, name: 'Math Class', code: 'ABC123' },
        { id: 2, name: 'Science Class', code: 'XYZ456' },
      ];
      ClassService.getRunningClass.mockResolvedValue(runningClassesMock);

      const { req, res } = setupExpressMock();

      await ClassController.getRunningClass(req, res);

      expect(ClassService.getRunningClass).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: runningClassesMock });
    });
  });

  describe('getStudentClassesByUserId', () => {
    it('should return student classes by user id and return 200', async () => {
      const studentClassesMock = [
        { id: 1, name: 'Math Class', code: 'ABC123' },
      ];
      ClassService.getStudentClassesByUserId.mockResolvedValue(studentClassesMock);

      const { req, res } = setupExpressMock({
        req: { params: { userId: '42' } },
      });

      await ClassController.getStudentClassesByUserId(req, res);

      expect(ClassService.getStudentClassesByUserId).toHaveBeenCalledWith('42');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: studentClassesMock });
    });
  });

  describe('getFinishedClasses', () => {
    it('should return finished classes and return 200', async () => {
      const finishedClassesMock = [
        { id: 3, name: 'History Class', code: 'HIS789' },
      ];
      ClassService.getFinishedClasses.mockResolvedValue(finishedClassesMock);

      const { req, res } = setupExpressMock();

      await ClassController.getFinishedClasses(req, res);

      expect(ClassService.getFinishedClasses).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: finishedClassesMock });
    });
  });
});