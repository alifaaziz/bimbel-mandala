import { jest } from '@jest/globals';
import { HttpError } from '../../utils/error.js';

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: {
    notification: {
      findFirst: jest.fn(),
    },
  },
}));

const { NotificationMiddleware } = await import('../notification.js');
const { prisma } = await import('../../utils/db.js');

describe('NotificationMiddleware', () => {
  describe('isNotificationExists', () => {
    it('should call next and set res.locals.notification if found', async () => {
      const notification = { id: 'notif1', userId: 'user1' };
      prisma.notification.findFirst.mockResolvedValue(notification);

      const req = { params: { id: 'notif1' } };
      const res = { locals: { user: { id: 'user1' } } };
      const next = jest.fn();

      await NotificationMiddleware.isNotificationExists(req, res, next);

      expect(prisma.notification.findFirst).toHaveBeenCalledWith({
        where: { id: 'notif1', userId: 'user1' },
      });
      expect(res.locals.notification).toBe(notification);
      expect(next).toHaveBeenCalledWith();
    });

    it('should throw HttpError 404 if notification not found', async () => {
      prisma.notification.findFirst.mockResolvedValue(null);

      const req = { params: { id: 'notif2' } };
      const res = { locals: { user: { id: 'user2' } } };
      const next = jest.fn();

      let thrownError;
      try {
        await NotificationMiddleware.isNotificationExists(req, res, next);
      } catch (err) {
        thrownError = err;
      }

      expect(prisma.notification.findFirst).toHaveBeenCalledWith({
        where: { id: 'notif2', userId: 'user2' },
      });
      expect(thrownError).toBeInstanceOf(HttpError);
      expect(thrownError.statusCode).toBe(404);
      expect(thrownError.message).toBe('Notification not found');
      expect(next).not.toHaveBeenCalled();
    });
  });
});