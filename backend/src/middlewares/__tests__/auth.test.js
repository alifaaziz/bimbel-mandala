import { jest } from '@jest/globals';
import { setupExpressMock, getFunctionThrownError } from '../../utils/jest.js';

const userMock = { id: 1, email: 'test@mail.com', role: 'admin' };

jest.unstable_mockModule('../../services/auth.js', () => ({
  AuthService: {
    getAuthorizationBearerToken: jest.fn(() => 'mocked_token'),
    verifyToken: jest.fn(() => Promise.resolve(userMock)),
  },
}));

const { AuthMiddleware } = await import('../auth.js');
const { AuthService } = await import('../../services/auth.js');

describe('AuthMiddleware', () => {
  describe('isAuthorized', () => {
    it('should attach user to res.locals and call next if token valid', async () => {
      AuthService.getAuthorizationBearerToken.mockReturnValue('mocked_token');
      AuthService.verifyToken.mockResolvedValue(userMock);

      const { req, res, next } = setupExpressMock();

      await AuthMiddleware.isAuthorized(req, res, next);

      expect(AuthService.getAuthorizationBearerToken).toHaveBeenCalledWith(req);
      expect(AuthService.verifyToken).toHaveBeenCalledWith('mocked_token');
      expect(res.locals.user).toEqual(userMock);
      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with error if AuthService throws', async () => {
      const error = new Error('Invalid token');
      AuthService.getAuthorizationBearerToken.mockReturnValue('mocked_token');
      AuthService.verifyToken.mockRejectedValue(error);

      const { req, res, next } = setupExpressMock();

      await AuthMiddleware.isAuthorized(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('hasRole', () => {
    it('should call next if user has allowed role', () => {
      const { req, res, next } = setupExpressMock({
        res: { locals: { user: { ...userMock, role: 'admin' } } },
      });

      AuthMiddleware.hasRole(['admin'])(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should return 403 if user role is not allowed', () => {
      const { req, res, next } = setupExpressMock({
        res: { 
          locals: { user: { ...userMock, role: 'student' } },
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        },
      });

      AuthMiddleware.hasRole(['admin'])(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. Insufficient permissions.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if user is missing', () => {
      const { req, res, next } = setupExpressMock({
        res: { 
          locals: {},
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        },
      });

      AuthMiddleware.hasRole(['admin'])(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied. Insufficient permissions.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if exception thrown in hasRole', () => {
        const error = new Error('role error');
        const user = {};
        Object.defineProperty(user, 'role', {
            get() { throw error; }
        });

        const { req, res, next } = setupExpressMock({
            res: { locals: { user } }
        });

        AuthMiddleware.hasRole(['admin'])(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
  });
});