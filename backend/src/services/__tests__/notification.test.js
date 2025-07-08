import { jest } from '@jest/globals';

const mockPrisma = {
    notification: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn()
    }
};

jest.unstable_mockModule('../../utils/db.js', () => ({
    prisma: mockPrisma
}));

const { NotificationService } = await import('../notification.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('NotificationService', () => {
    it('getNotifications returns user notifications (only not viewed)', async () => {
        mockPrisma.notification.findMany.mockResolvedValueOnce([{ id: 1 }]);
        const result = await NotificationService.getNotifications('user1');
        expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
            where: { userId: 'user1', viewed: false },
            orderBy: { createdAt: 'desc' }
        });
        expect(result).toEqual([{ id: 1 }]);
    });

    it('markNotificationAsRead updates notification as viewed', async () => {
        mockPrisma.notification.findFirst.mockResolvedValueOnce({ id: 1 });
        mockPrisma.notification.update.mockResolvedValueOnce({});
        await NotificationService.markNotificationAsRead('user1', 'notif1');
        expect(mockPrisma.notification.findFirst).toHaveBeenCalledWith({
            where: { id: 'notif1', userId: 'user1' }
        });
        expect(mockPrisma.notification.update).toHaveBeenCalledWith({
            where: { id: 'notif1' },
            data: { viewed: true }
        });
    });

    it('markAllNotificationsAsRead updates all as viewed', async () => {
        mockPrisma.notification.updateMany.mockResolvedValueOnce({});
        await NotificationService.markAllNotificationsAsRead('user1');
        expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
            where: { userId: 'user1', viewed: false },
            data: { viewed: true }
        });
    });

    it('deleteNotification deletes all notifications older than 30 days', async () => {
        const mockResult = { count: 5 };
        mockPrisma.notification.deleteMany.mockResolvedValueOnce(mockResult);

        const now = Date.now();
        await NotificationService.deleteNotification();

        expect(mockPrisma.notification.deleteMany).toHaveBeenCalledWith({
            where: {
                createdAt: { lt: expect.any(Date) }
            }
        });
    });
});