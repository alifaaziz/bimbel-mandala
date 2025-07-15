import { jest } from '@jest/globals';
import { generatePrismaMock } from '../../utils/jest.js';

const mockPrisma = generatePrismaMock().prisma;
const mockClassService = { createClass: jest.fn() };
const mockScheduleService = { createSchedules: jest.fn() };

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
    it('should create order and deactivate package if groupType.type !== "kelas"', async () => {
      mockPrisma.groupType.findUnique.mockResolvedValueOnce({ type: 'reguler' });
      mockPrisma.order.create.mockResolvedValueOnce({});
      mockPrisma.bimbelPackage.update.mockResolvedValueOnce({});
      await OrderService.createOrder('user1', 'pkg1', 'grp1', 'address');
      expect(mockPrisma.order.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          packageId: 'pkg1',
          groupTypeId: 'grp1',
          address: 'address',
          status: 'pending',
          amount: 0 
        }
      });
      expect(mockPrisma.bimbelPackage.update).toHaveBeenCalledWith({
        where: { id: 'pkg1' },
        data: { isActive: false }
      });
    });

    it('should create order and not deactivate package if groupType.type === "kelas"', async () => {
      mockPrisma.groupType.findUnique.mockResolvedValueOnce({ type: 'kelas' });
      mockPrisma.order.create.mockResolvedValueOnce({});
      await OrderService.createOrder('user1', 'pkg1', 'grp1', 'address');
      expect(mockPrisma.order.create).toHaveBeenCalled();
      expect(mockPrisma.bimbelPackage.update).not.toHaveBeenCalled();
    });

    it('should use discPrice as amount if discPrice is present and > 0', async () => {
      mockPrisma.groupType.findUnique.mockResolvedValueOnce({ type: 'reguler', price: 100000, discPrice: 90000 });
      mockPrisma.order.create.mockResolvedValueOnce({});
      mockPrisma.bimbelPackage.update.mockResolvedValueOnce({});
      await OrderService.createOrder('user1', 'pkg1', 'grp1', 'address');
      expect(mockPrisma.order.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          packageId: 'pkg1',
          groupTypeId: 'grp1',
          address: 'address',
          status: 'pending',
          amount: 90000 // discPrice
        }
      });
      expect(mockPrisma.bimbelPackage.update).toHaveBeenCalled();
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order to paid and add student to existing class if groupType.type === "kelas"', async () => {
      mockPrisma.order.update.mockResolvedValueOnce({
        id: 'order1',
        userId: 'user1',
        packageId: 'pkg1',
        groupType: { type: 'kelas' },
        bimbelPackage: { name: 'Paket', level: 'SMA', userId: 'tutor1', user: {} }
      });
      mockPrisma.order.findFirst.mockResolvedValueOnce({ id: 'dummyOrder1' });
      mockPrisma.class.findFirst.mockResolvedValueOnce({ id: 'class1' });
      mockPrisma.studentClass.findFirst.mockResolvedValueOnce(null);
      mockPrisma.studentClass.create.mockResolvedValueOnce({});
      const result = await OrderService.updateOrderStatus('order1', 'paid');
      expect(mockPrisma.studentClass.create).toHaveBeenCalledWith({
        data: { userId: 'user1', classId: 'class1' }
      });
      expect(result).toHaveProperty('id', 'order1');
    });

    it('should not add student if already in class (kelas)', async () => {
      mockPrisma.order.update.mockResolvedValueOnce({
        id: 'order1',
        userId: 'user1',
        packageId: 'pkg1',
        groupType: { type: 'kelas' },
        bimbelPackage: { name: 'Paket', level: 'SMA', userId: 'tutor1', user: {} }
      });
      mockPrisma.order.findFirst.mockResolvedValueOnce({ id: 'dummyOrder1' });
      mockPrisma.class.findFirst.mockResolvedValueOnce({ id: 'class1' });
      mockPrisma.studentClass.findFirst.mockResolvedValueOnce({ id: 'sc1' });
      const result = await OrderService.updateOrderStatus('order1', 'paid');
      expect(mockPrisma.studentClass.create).not.toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'order1');
    });

    it('should throw if dummy order not found (kelas)', async () => {
      mockPrisma.order.update.mockResolvedValueOnce({
        id: 'order1',
        userId: 'user1',
        packageId: 'pkg1',
        groupType: { type: 'kelas' },
        bimbelPackage: { name: 'Paket', level: 'SMA', userId: 'tutor1', user: {} }
      });
      mockPrisma.order.findFirst.mockResolvedValueOnce(null);
      await expect(OrderService.updateOrderStatus('order1', 'paid'))
        .rejects.toThrow('Dummy order/class untuk paket ini tidak ditemukan.');
    });

    it('should throw if class not found (kelas)', async () => {
      mockPrisma.order.update.mockResolvedValueOnce({
        id: 'order1',
        userId: 'user1',
        packageId: 'pkg1',
        groupType: { type: 'kelas' },
        bimbelPackage: { name: 'Paket', level: 'SMA', userId: 'tutor1', user: {} }
      });
      mockPrisma.order.findFirst.mockResolvedValueOnce({ id: 'dummyOrder1' });
      mockPrisma.class.findFirst.mockResolvedValueOnce(null);
      await expect(OrderService.updateOrderStatus('order1', 'paid'))
        .rejects.toThrow('Class untuk paket ini tidak ditemukan.');
    });

    it('should update order to paid and create class, schedules, and notifications (non-kelas)', async () => {
      mockPrisma.order.update.mockResolvedValueOnce({
        id: 'order2',
        userId: 'user2',
        packageId: 'pkg2',
        groupType: { type: 'reguler' },
        bimbelPackage: { name: 'Paket', level: 'SMA', userId: 'tutor2', user: {} }
      });
      mockClassService.createClass.mockResolvedValueOnce({ id: 'class2', code: 'C2' });
      mockScheduleService.createSchedules.mockResolvedValueOnce();
      mockPrisma.tutor.findUnique.mockResolvedValueOnce({
        userId: 'tutor2',
        gender: 'Male',
        user: { name: 'Budi' },
        photo: 'photo.jpg'
      });
      mockPrisma.notification.create.mockResolvedValue({});
      const result = await OrderService.updateOrderStatus('order2', 'paid');
      expect(mockClassService.createClass).toHaveBeenCalledWith({ orderId: 'order2' });
      expect(mockScheduleService.createSchedules).toHaveBeenCalledWith('class2');
      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user2',
          type: 'Program',
          description: expect.stringContaining('Bimbingan belajar <strong>Paket SMA #C2</strong> bersama <strong>Pak Budi</strong> sudah terkonfirmasi'),
          photo: 'photo.jpg'
        })
      });
      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'tutor2',
          type: 'Program',
          description: expect.stringContaining('Bimbingan belajar <strong>Paket SMA #C2</strong> sudah terkonfirmasi'),
          photo: 'photo.jpg'
        })
      });
      expect(result).toHaveProperty('id', 'order2');
    });

    it('should use "Bu" if tutor.gender is not Male and fallback name if missing', async () => {
      mockPrisma.order.update.mockResolvedValueOnce({
        id: 'order4',
        userId: 'user4',
        packageId: 'pkg4',
        groupType: { type: 'reguler' },
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
        data: expect.objectContaining({
          userId: 'user4',
          type: 'Program',
          description: expect.stringContaining('Bimbingan belajar <strong>Paket SMA #C4</strong> bersama <strong>Bu Tutor</strong> sudah terkonfirmasi'),
          photo: null
        })
      });
    });

    it('should update order to non-paid and create notification', async () => {
      mockPrisma.order.update.mockResolvedValueOnce({
        id: 'order3',
        userId: 'user3',
        bimbelPackage: { user: { tutor: { photo: 'photo3.jpg' } } }
      });
      mockPrisma.notification.create.mockResolvedValueOnce({});
      const result = await OrderService.updateOrderStatus('order3', 'cancel');
      expect(mockPrisma.order.update).toHaveBeenCalled();
      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user3',
          type: 'Program',
          description: expect.stringContaining('The order status has been updated to <strong>cancel</strong>'),
          photo: 'photo3.jpg'
        }
      });
      expect(result).toHaveProperty('id', 'order3');
    });
  });

  describe('getPendingOrders', () => {
    it('should return pending orders with mapped fields and pagination', async () => {
      mockPrisma.order.findMany.mockResolvedValueOnce([
        {
          id: 1,
          bimbelPackage: { name: 'Paket A', level: 'SMA', user: { name: 'Budi' } },
          status: 'pending'
        },
        {
          id: 2,
          bimbelPackage: null,
          status: 'pending'
        }
      ]);
      mockPrisma.order.count.mockResolvedValueOnce(2);

      const result = await OrderService.getPendingOrders({ page: 1, limit: 10 });
      expect(result).toEqual({
        data: [
          {
            id: 1,
            packageName: 'Paket A',
            level: 'SMA',
            tutorName: 'Budi',
            status: 'pending'
          },
          {
            id: 2,
            packageName: null,
            level: null,
            tutorName: null,
            status: 'pending'
          }
        ],
        total: 2,
        page: 1,
        pageSize: 10
      });
    });
  });

  describe('getOrderById', () => {
    it('should return order by id with all fields', async () => {
      mockPrisma.order.findUnique.mockResolvedValueOnce({
        id: 'order1',
        user: { name: 'Siswa' },
        bimbelPackage: {
          name: 'Paket A',
          level: 'SMA',
          area: 'Jakarta',
          totalMeetings: 10,
          time: '10:00',
          duration: 90,
          user: { name: 'Budi' },
          groupType: { id: 1, type: 'Reguler', price: 100000, discPrice: 90000 },
          packageDay: [
            { day: { daysName: 'Senin' } },
            { day: { daysName: 'Rabu' } }
          ]
        },
        groupType: { id: 1, type: 'Reguler', price: 100000, discPrice: 90000 },
        address: 'Jl. Mawar'
      });
      const result = await OrderService.getOrderById('order1');
      expect(result).toMatchObject({
        id: 'order1',
        packageName: 'Paket A',
        level: 'SMA',
        tutorName: 'Budi',
        area: 'Jakarta',
        totalMeetings: 10,
        time: '10:00',
        duration: 90,
        type: 'Reguler',
        paid: 90000,
        studentName: 'Siswa',
        address: 'Jl. Mawar',
        startDate: expect.any(String)
      });
    });

    it('should return null if order not found', async () => {
      mockPrisma.order.findUnique.mockResolvedValueOnce(null);
      const result = await OrderService.getOrderById('notfound');
      expect(result).toBeNull();
    });

    it('should handle missing groupType and packageDay gracefully', async () => {
      mockPrisma.order.findUnique.mockResolvedValueOnce({
        id: 'order2',
        user: null,
        bimbelPackage: {
          name: 'Paket B',
          level: 'SMP',
          area: null,
          totalMeetings: null,
          time: null,
          duration: null,
          user: null,
          groupType: null,
          packageDay: null
        },
        groupType: null,
        address: null
      });
      const result = await OrderService.getOrderById('order2');
      expect(result).toMatchObject({
        id: 'order2',
        packageName: 'Paket B',
        level: 'SMP',
        tutorName: null,
        area: null,
        totalMeetings: null,
        time: null,
        duration: null,
        type: null,
        paid: null,
        studentName: null,
        address: null,
        startDate: null
      });
    });

    it('should set paid to price if discPrice is null', async () => {
      mockPrisma.order.findUnique.mockResolvedValueOnce({
        id: 'order3',
        user: { name: 'Siswa' },
        bimbelPackage: {
          name: 'Paket C',
          level: 'SMA',
          area: 'Jakarta',
          totalMeetings: 8,
          time: '09:00',
          duration: 60,
          user: { name: 'Budi' },
          groupType: { id: 2, type: 'Reguler', price: 120000, discPrice: null },
          packageDay: null
        },
        groupType: { id: 2, type: 'Reguler', price: 120000, discPrice: null },
        address: 'Jl. Melati'
      });
      const result = await OrderService.getOrderById('order3');
      expect(result.paid).toBe(120000);
    });

    it('should set startDate to next week if packageDay is today', async () => {
      // Mock hari ini, misal Senin (getDay() === 1)
      const realDate = Date;
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            // 2025-07-07 is Monday
            return new realDate('2025-07-07T10:00:00Z');
          }
          return new realDate(...args);
        }
        static now() {
          return new realDate('2025-07-07T10:00:00Z').getTime();
        }
      };

      mockPrisma.order.findUnique.mockResolvedValueOnce({
        id: 'orderToday',
        user: { name: 'Siswa' },
        bimbelPackage: {
          name: 'Paket D',
          level: 'SMA',
          area: 'Jakarta',
          totalMeetings: 12,
          time: '10:00',
          duration: 90,
          user: { name: 'Budi' },
          groupType: { id: 3, type: 'Reguler', price: 150000, discPrice: 140000 },
          packageDay: [
            { day: { daysName: 'Senin' } } // Hari ini
          ]
        },
        groupType: { id: 3, type: 'Reguler', price: 150000, discPrice: 140000 },
        address: 'Jl. Kenanga'
      });

      const result = await OrderService.getOrderById('orderToday');
      // Karena hari ini Senin, maka startDate harus Senin minggu depan (2025-07-14)
      expect(result.startDate).toBe('2025-07-14');

      global.Date = realDate; // restore
    });

    it('should set packageName and level to null if bimbelPackage is null', async () => {
      mockPrisma.order.findUnique.mockResolvedValueOnce({
        id: 'orderNullPkg',
        user: { name: 'Siswa' },
        bimbelPackage: null,
        groupType: null,
        address: 'Jl. Mawar'
      });
      const result = await OrderService.getOrderById('orderNullPkg');
      expect(result.packageName).toBeNull();
      expect(result.level).toBeNull();
    });

    it('should set packageName and level to null if bimbelPackage.name or level is missing', async () => {
      mockPrisma.order.findUnique.mockResolvedValueOnce({
        id: 'orderMissingName',
        user: { name: 'Siswa' },
        bimbelPackage: { name: null, level: undefined },
        groupType: null,
        address: 'Jl. Mawar'
      });
      const result = await OrderService.getOrderById('orderMissingName');
      expect(result.packageName).toBeNull();
      expect(result.level).toBeNull();
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
    it('should cancel orders pending > 2 days and log count', async () => {
      mockPrisma.order.updateMany.mockResolvedValueOnce({ count: 2 });
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      await OrderService.cancelPendingOrders();
      expect(mockPrisma.order.updateMany).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Orders cancelled: 2'));
      spy.mockRestore();
    });
  });
});