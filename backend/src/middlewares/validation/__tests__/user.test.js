import { jest } from '@jest/globals';

const findFirst = jest.fn();
const findUnique = jest.fn();
jest.unstable_mockModule('../../../utils/db.js', () => ({
  prisma: {
    user: {
      findFirst,
      findUnique,
    },
  },
}));

import {
  getFunctionThrownError,
  setupExpressMock
} from '../../../utils/jest.js';
import { HttpError } from '../../../utils/error.js';

const { prisma } = await import('../../../utils/db.js');
const { UserValidation } = await import('../user.js');

describe('User Validation Middleware', () => {
  beforeEach(() => {
    findFirst.mockReset();
    findUnique.mockReset();
  });

  describe('isUnverifiedUserExistsPayload', () => {
    it('should call next() if unverified user exists', async () => {
      const { req, res, next } = setupExpressMock({
        req: {
          body: {
            email: 'unverified@example.com'
          }
        }
      });

      findFirst.mockResolvedValue({
        email: 'unverified@example.com',
        verified: false
      });

      await UserValidation.isUnverifiedUserExistsPayload(req, res, next);

      expect(findFirst).toHaveBeenCalledWith({
        where: { email: 'unverified@example.com', verified: false }
      });
      expect(res.locals.user).toEqual({
        email: 'unverified@example.com',
        verified: false
      });
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should throw an HttpError if no unverified user is found', async () => {
      const { req, res, next } = setupExpressMock({
        req: {
          body: {
            email: 'nonexistent@example.com'
          }
        }
      });

      findFirst.mockResolvedValue(null);

      const error = await getFunctionThrownError(() =>
        UserValidation.isUnverifiedUserExistsPayload(req, res, next)
      );

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 404);
      expect(error).toHaveProperty('message', 'User not found');
    });
  });

  describe('isValidUserUpdatePayload', () => {
    it('should call next() if user exists', async () => {
      const { req, res, next } = setupExpressMock({
        res: {
          locals: { user: { id: 1 } }
        }
      });

      findUnique.mockResolvedValue({ id: 1 });

      await UserValidation.isValidUserUpdatePayload(req, res, next);

      expect(findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should throw an HttpError if user not found', async () => {
      const { req, res, next } = setupExpressMock({
        res: {
          locals: { user: { id: 2 } }
        }
      });

      findUnique.mockResolvedValue(null);

      const error = await getFunctionThrownError(() =>
        UserValidation.isValidUserUpdatePayload(req, res, next)
      );

      expect(error).toBeInstanceOf(HttpError);
      expect(error).toHaveProperty('statusCode', 404);
      expect(error).toHaveProperty('message', 'User not found');
    });
  });
});