import { jest } from '@jest/globals';

const mockPrisma = {
    notification: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn()
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

    it('deleteNotification deletes notification', async () => {
        mockPrisma.notification.findFirst.mockResolvedValueOnce({ id: 1 });
        mockPrisma.notification.delete.mockResolvedValueOnce({});
        await NotificationService.deleteNotification('user1', 'notif1');
        expect(mockPrisma.notification.findFirst).toHaveBeenCalledWith({
            where: { id: 'notif1', userId: 'user1' }
        });
        expect(mockPrisma.notification.delete).toHaveBeenCalledWith({
            where: { id: 'notif1' }
        });
    });

    describe('getAllNotifications', () => {
        it('should parse programName and classCode if type matches and description matches', async () => {
            mockPrisma.notification.findMany.mockResolvedValueOnce([
                {
                    id: 1,
                    type: 'Program',
                    createdAt: new Date(),
                    description: '<b>Test</b> ... <b>Paket A #CLS1</b>',
                    user: { id: 1, name: 'User', role: 'siswa' }
                }
            ]);
            const result = await NotificationService.getAllNotifications();
            expect(result[0]).toMatchObject({
                programName: 'Paket A',
                classCode: 'CLS1'
            });
        });

        it('should set programName and classCode null if type does not match', async () => {
            mockPrisma.notification.findMany.mockResolvedValueOnce([
                {
                    id: 2,
                    type: 'Other',
                    createdAt: new Date(),
                    description: 'No match',
                    user: { id: 2, name: 'User2', role: 'tutor' }
                }
            ]);
            const result = await NotificationService.getAllNotifications();
            expect(result[0]).toMatchObject({
                programName: null,
                classCode: null
            });
        });

        it('should set programName and classCode null if description does not match', async () => {
            mockPrisma.notification.findMany.mockResolvedValueOnce([
                {
                    id: 3,
                    type: 'Program',
                    createdAt: new Date(),
                    description: 'No <b>pattern</b> here',
                    user: { id: 3, name: 'User3', role: 'siswa' }
                }
            ]);
            const result = await NotificationService.getAllNotifications();
            expect(result[0]).toMatchObject({
                programName: null,
                classCode: null
            });
        });
    });
});