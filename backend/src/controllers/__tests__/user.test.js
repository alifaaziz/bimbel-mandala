import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

// Mock UserService sesuai dengan fungsi yang ada di service
const userMock = { id: 123, name: 'Test User', role: 'siswa' };

jest.unstable_mockModule('../../services/user.js', () => ({
  UserService: {
    getUserById: jest.fn(() => Promise.resolve(userMock)),
    createUser: jest.fn(() => Promise.resolve(userMock)),
    getTopStudents: jest.fn(() => Promise.resolve([userMock])),
    getNewStudents: jest.fn(() => Promise.resolve([userMock])),
    getTutorsSortedByClassCount: jest.fn(() => Promise.resolve([userMock])),
    updateUser: jest.fn(() => Promise.resolve()),
  },
}));

const { UserController } = await import('../../controllers/user.js');
const { UserService } = await import('../../services/user.js');

describe('UserController', () => {
  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      const { req, res } = setupExpressMock({
        res: { locals: { user: userMock } },
      });

      await UserController.getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: userMock });
    });
  });

  describe('createUser', () => {
    it('should create a user and return 201', async () => {
      UserService.createUser.mockResolvedValue(userMock);

      const { req, res } = setupExpressMock({
        req: { body: { name: 'Test User' } },
      });

      await UserController.createUser(req, res);

      expect(UserService.createUser).toHaveBeenCalledWith({ name: 'Test User' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: userMock });
    });
  });

  describe('updateCurrentUser', () => {
    it('should update the current user successfully', async () => {
      UserService.updateUser.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { body: { name: 'Updated User', email: 'updated@example.com' }, file: undefined },
        res: { locals: { user: { id: 123, role: 'siswa' } } },
      });

      await UserController.updateCurrentUser(req, res);

      expect(UserService.updateUser).toHaveBeenCalledWith(
        {
          id: 123,
          role: 'siswa',
          name: 'Updated User',
          email: 'updated@example.com'
        },
        undefined
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
      });
    });
  });

  describe('getTopStudents', () => {
    it('should return top students', async () => {
      UserService.getTopStudents.mockResolvedValue([userMock]);

      const { req, res } = setupExpressMock();

      await UserController.getTopStudents(req, res);

      expect(UserService.getTopStudents).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: [userMock] });
    });
  });

  describe('getNewStudents', () => {
    it('should return new students', async () => {
      UserService.getNewStudents.mockResolvedValue([userMock]);

      const { req, res } = setupExpressMock();

      await UserController.getNewStudents(req, res);

      expect(UserService.getNewStudents).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: [userMock] });
    });
  });

  describe('getTutorsSortedByClassCount', () => {
    it('should return tutors sorted by class count', async () => {
      UserService.getTutorsSortedByClassCount.mockResolvedValue([userMock]);

      const { req, res } = setupExpressMock();

      await UserController.getTutorsSortedByClassCount(req, res);

      expect(UserService.getTutorsSortedByClassCount).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: [userMock] });
    });
  });
});