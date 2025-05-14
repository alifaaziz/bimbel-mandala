import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const notificationsMock = [{ id: 1, message: 'Notif 1' }];

jest.unstable_mockModule('../../services/notification.js', () => ({
  NotificationService: {
    getNotifications: jest.fn(() => Promise.resolve(notificationsMock)),
    markNotificationAsRead: jest.fn(() => Promise.resolve()),
    markAllNotificationsAsRead: jest.fn(() => Promise.resolve()),
    deleteNotification: jest.fn(() => Promise.resolve()),
    getAllNotifications: jest.fn(() => Promise.resolve(notificationsMock)),
  },
}));

const { NotificationController } = await import('../../controllers/notification.js');
const { NotificationService } = await import('../../services/notification.js');

describe('NotificationController', () => {
  describe('getNotifications', () => {
    it('should return notifications for current user', async () => {
      NotificationService.getNotifications.mockResolvedValue(notificationsMock);

      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 123 } } },
      });

      await NotificationController.getNotifications(req, res);

      expect(NotificationService.getNotifications).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: notificationsMock });
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark a notification as read', async () => {
      NotificationService.markNotificationAsRead.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { params: { id: 1 } },
        res: { locals: { user: { id: 123 } } },
      });

      await NotificationController.markNotificationAsRead(req, res);

      expect(NotificationService.markNotificationAsRead).toHaveBeenCalledWith(123, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Notification marked as read' });
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read', async () => {
      NotificationService.markAllNotificationsAsRead.mockResolvedValue();

      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 123 } } },
      });

      await NotificationController.markAllNotificationsAsRead(req, res);

      expect(NotificationService.markAllNotificationsAsRead).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'All notifications marked as read' });
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      NotificationService.deleteNotification.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { params: { id: 1 } },
        res: { locals: { user: { id: 123 } } },
      });

      await NotificationController.deleteNotification(req, res);

      expect(NotificationService.deleteNotification).toHaveBeenCalledWith(123, 1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Notification deleted' });
    });
  });

  describe('getAllNotifications', () => {
    it('should return all notifications (admin)', async () => {
      NotificationService.getAllNotifications.mockResolvedValue(notificationsMock);

      const { req, res } = setupExpressMock();

      await NotificationController.getAllNotifications(req, res);

      expect(NotificationService.getAllNotifications).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: notificationsMock });
    });
  });
});