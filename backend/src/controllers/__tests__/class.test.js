import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const classMock = { id: 1, name: 'Test Class' };
const joinedClassMock = { id: 2, code: 'ABC123' };
const myClassesMock = [{ id: 3, name: 'Math' }];

jest.unstable_mockModule('../../services/class.js', () => ({
  ClassService: {
    createClass: jest.fn(() => Promise.resolve(classMock)),
    joinClass: jest.fn(() => Promise.resolve(joinedClassMock)),
    getMyClass: jest.fn(() => Promise.resolve(myClassesMock)),
  },
}));

const { ClassController } = await import('../../controllers/class.js');
const { ClassService } = await import('../../services/class.js');

describe('ClassController', () => {
  describe('createClass', () => {
    it('should create a class and return 201', async () => {
      ClassService.createClass.mockResolvedValue(classMock);

      const { req, res } = setupExpressMock({
        req: { body: { name: 'Test Class' } },
      });

      await ClassController.createClass(req, res);

      expect(ClassService.createClass).toHaveBeenCalledWith({ name: 'Test Class' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: classMock });
    });
  });

  describe('joinClass', () => {
    it('should join a class and return 200', async () => {
      ClassService.joinClass.mockResolvedValue(joinedClassMock);

      const { req, res } = setupExpressMock({
        req: { body: { code: 'ABC123' } },
        res: { locals: { user: { id: 123 } } },
      });

      await ClassController.joinClass(req, res);

      expect(ClassService.joinClass).toHaveBeenCalledWith({ code: 'ABC123', userId: 123 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: joinedClassMock });
    });
  });

  describe('getMyClass', () => {
    it('should get user classes and return 200', async () => {
      ClassService.getMyClass.mockResolvedValue(myClassesMock);

      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 123 } } },
      });

      await ClassController.getMyClass(req, res);

      expect(ClassService.getMyClass).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: myClassesMock });
    });
  });
});