import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const userMock = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
const tutorsMock = [
  { id: 1, name: 'Tutor A', classCount: 5 },
  { id: 2, name: 'Tutor B', classCount: 3 },
];
const studentsMock = [
  { id: 1, name: 'Student A', createdAt: '2023-01-01' },
  { id: 2, name: 'Student B', createdAt: '2023-01-02' },
];
const statisticsMock = { totalUsers: 100, totalTutors: 10, totalStudents: 90 };

jest.unstable_mockModule('../../services/user.js', () => ({
  UserService: {
    getUserById: jest.fn(() => Promise.resolve(userMock)),
    createUser: jest.fn(() => Promise.resolve(userMock)),
    updateUser: jest.fn(() => Promise.resolve()),
    getTutorsSortedByClassCount: jest.fn(() => Promise.resolve(tutorsMock)),
    getTopStudents: jest.fn(() => Promise.resolve(studentsMock)),
    getNewStudents: jest.fn(() => Promise.resolve(studentsMock)),
    getStatistics: jest.fn(() => Promise.resolve(statisticsMock)),
  },
}));

const { UserController } = await import('../../controllers/user.js');
const { UserService } = await import('../../services/user.js');

describe('UserController', () => {
  describe('createUser', () => {
    it('should create a new user and return 201', async () => {
      const { req, res } = setupExpressMock({
        req: { body: { name: 'John Doe', email: 'john.doe@example.com' } },
      });

      await UserController.createUser(req, res);

      expect(UserService.createUser).toHaveBeenCalledWith({ name: 'John Doe', email: 'john.doe@example.com' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: userMock });
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 1 } } },
      });

      await UserController.getCurrentUser(req, res);

      expect(UserService.getUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: userMock });
    });
  });

  describe('updateCurrentUser', () => {
    it('should update the current user and return 200', async () => {
      const { req, res } = setupExpressMock({
        req: { body: { name: 'Updated Name' }, file: { filename: 'profile.jpg' } },
        res: { locals: { user: { id: 1, role: 'student' } } },
      });

      await UserController.updateCurrentUser(req, res);

      expect(UserService.updateUser).toHaveBeenCalledWith(
        { id: 1, role: 'student', name: 'Updated Name' },
        { filename: 'profile.jpg' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User updated successfully' });
    });
  });

  describe('getTutorsSortedByClassCount', () => {
    it('should return tutors sorted by class count', async () => {
      const { req, res } = setupExpressMock();

      await UserController.getTutorsSortedByClassCount(req, res);

      expect(UserService.getTutorsSortedByClassCount).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: tutorsMock });
    });
  });

  describe('getTopStudents', () => {
    it('should return top students sorted by createdAt', async () => {
      const { req, res } = setupExpressMock();

      await UserController.getTopStudents(req, res);

      expect(UserService.getTopStudents).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: studentsMock });
    });
  });

  describe('getNewStudents', () => {
    it('should return newly registered students', async () => {
      const { req, res } = setupExpressMock();

      await UserController.getNewStudents(req, res);

      expect(UserService.getNewStudents).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: studentsMock });
    });
  });

  describe('getStatistics', () => {
    it('should return statistics', async () => {
      const { req, res } = setupExpressMock();

      await UserController.getStatistics(req, res);

      expect(UserService.getStatistics).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: statisticsMock });
    });
  });
});