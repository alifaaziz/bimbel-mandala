import { jest } from '@jest/globals';

const mockPrisma = {
    order: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
        updateMany: jest.fn()
    },
    bimbelPackage: {
        update: jest.fn()
    },
    tutor: {
        findUnique: jest.fn()
    },
    notification: {
        create: jest.fn()
    }
};

const mockClassService = {
    createClass: jest.fn()
};

const mockScheduleService = {
    createSchedules: jest.fn()
};

jest.unstable_mockModule('../../utils/db.js', () => ({
    prisma: mockPrisma
}));

jest.unstable_mockModule('../class.js', () => ({
    ClassService: mockClassService
}));

jest.unstable_mockModule('../schedule.js', () => ({
    ScheduleService: mockScheduleService
}));

const { OrderService } = await import('../order.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('OrderService', () => {
    describe('createOrder', () => {
        it('should create order and deactivate package', async () => {
            mockPrisma.order.create.mockResolvedValueOnce({});
            mockPrisma.bimbelPackage.update.mockResolvedValueOnce({});
            await OrderService.createOrder('user1', 'pkg1', 'grp1', 'address');
            expect(mockPrisma.order.create).toHaveBeenCalledWith({
                data: {
                    userId: 'user1',
                    packageId: 'pkg1',
                    groupTypeId: 'grp1',
                    address: 'address',
                    status: 'pending'
                }
            });
            expect(mockPrisma.bimbelPackage.update).toHaveBeenCalledWith({
                where: { id: 'pkg1' },
                data: { isActive: false }
            });
        });
    });

    describe('updateOrderStatus', () => {
        it('should update order to paid and create class, schedules, and notifications', async () => {
            mockPrisma.order.update.mockResolvedValueOnce({
                id: 'order1',
                userId: 'user1',
                bimbelPackage: { name: 'Paket', level: 'SMA', userId: 'tutor1', user: {} }
            });
            mockClassService.createClass.mockResolvedValueOnce({ id: 'class1', code: 'C1' });
            mockScheduleService.createSchedules.mockResolvedValueOnce();
            mockPrisma.tutor.findUnique.mockResolvedValueOnce({
                userId: 'tutor1',
                gender: 'Male',
                user: { name: 'Budi' },
                photo: 'photo.jpg'
            });
            mockPrisma.notification.create.mockResolvedValue({});

            const result = await OrderService.updateOrderStatus('order1', 'paid');
            expect(mockPrisma.order.update).toHaveBeenCalled();
            expect(mockClassService.createClass).toHaveBeenCalledWith({ orderId: 'order1' });
            expect(mockScheduleService.createSchedules).toHaveBeenCalledWith('class1');
            // Notifikasi untuk student
            expect(mockPrisma.notification.create).toHaveBeenCalledWith({
                data: {
                    userId: 'user1',
                    type: 'Program',
                    description: expect.stringContaining('Bimbingan belajar <strong>Paket SMA #C1</strong> bersama <strong>Pak Budi</strong> sudah terkonfirmasi'),
                    photo: 'photo.jpg'
                }
            });
            // Notifikasi untuk tutor
            expect(mockPrisma.notification.create).toHaveBeenCalledWith({
                data: {
                    userId: 'tutor1',
                    type: 'Program',
                    description: expect.stringContaining('Bimbingan belajar <strong>Paket SMA #C1</strong> sudah terkonfirmasi'),
                    photo: 'photo.jpg'
                }
            });
            expect(result).toHaveProperty('id', 'order1');
        });

        it('should update order to non-paid and create notification', async () => {
            mockPrisma.order.update.mockResolvedValueOnce({
                id: 'order2',
                userId: 'user2',
                bimbelPackage: { user: { tutor: { photo: 'photo2.jpg' } } }
            });
            mockPrisma.notification.create.mockResolvedValueOnce({});
            const result = await OrderService.updateOrderStatus('order2', 'cancel');
            expect(mockPrisma.order.update).toHaveBeenCalled();
            expect(mockPrisma.notification.create).toHaveBeenCalledWith({
                data: {
                    userId: 'user2',
                    type: 'Program',
                    description: expect.stringContaining('The order status has been updated to <strong>cancel</strong>'),
                    photo: 'photo2.jpg'
                }
            });
            expect(result).toHaveProperty('id', 'order2');
        });

        it('should use "Bu" if tutor.gender is not Male and fallback name if missing', async () => {
            mockPrisma.order.update.mockResolvedValueOnce({
                id: 'order4',
                userId: 'user4',
                bimbelPackage: { name: 'Paket', level: 'SMA', userId: 'tutor4', user: {} }
            });
            mockClassService.createClass.mockResolvedValueOnce({ id: 'class4', code: 'C4' });
            mockScheduleService.createSchedules.mockResolvedValueOnce();
            mockPrisma.tutor.findUnique.mockResolvedValueOnce({
                userId: 'tutor4',
                gender: 'Female',
                user: {},
                photo: null
            });
            mockPrisma.notification.create.mockResolvedValue({});

            const result = await OrderService.updateOrderStatus('order4', 'paid');
            expect(mockPrisma.notification.create).toHaveBeenCalledWith({
                data: {
                    userId: 'user4',
                    type: 'Program',
                    description: expect.stringContaining('Bimbingan belajar <strong>Paket SMA #C4</strong> bersama <strong>Bu Tutor</strong> sudah terkonfirmasi'),
                    photo: null
                }
            });
        });
    });

    describe('getAllOrders', () => {
        it('should return all orders', async () => {
            mockPrisma.order.findMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
            const result = await OrderService.getAllOrders();
            expect(result).toEqual([{ id: 1 }, { id: 2 }]);
        });
    });

    describe('getOrderById', () => {
        it('should return order by id', async () => {
            mockPrisma.order.findUnique.mockResolvedValueOnce({ id: 'order1' });
            const result = await OrderService.getOrderById('order1');
            expect(result).toEqual({ id: 'order1' });
        });
    });

    describe('deleteOrder', () => {
        it('should delete order by id', async () => {
            mockPrisma.order.delete.mockResolvedValueOnce({ id: 'order1' });
            const result = await OrderService.deleteOrder('order1');
            expect(result).toEqual({ id: 'order1' });
        });
    });

    describe('cancelPendingOrders', () => {
        it('should cancel orders pending > 2 days', async () => {
            mockPrisma.order.updateMany.mockResolvedValueOnce({ count: 2 });
            const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
            await OrderService.cancelPendingOrders();
            expect(mockPrisma.order.updateMany).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(expect.stringContaining('Orders cancelled: 2'));
            spy.mockRestore();
        });
    });
});