import { jest } from '@jest/globals';
import { generatePrismaMock } from '../../utils/jest.js';

const mockPrisma = generatePrismaMock();
const mockScheduleService = { createSchedules: jest.fn() };

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: mockPrisma.prisma,
}));
jest.unstable_mockModule('../schedule.js', () => ({
  ScheduleService: mockScheduleService
}));

const { BimbelPackageService } = await import('../package.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('BimbelPackageService', () => {
  describe('getActiveBimbelPackages', () => {
    it('should return active bimbel packages with pagination', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          name: 'Math Package',
          level: 'SMA',
          totalMeetings: 10,
          time: '10:00',
          duration: 60,
          area: 'Jakarta',
          slug: 'math-package',
          isActive: true,
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }]
        }
      ]);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(1);

      const result = await BimbelPackageService.getActiveBimbelPackages({ page: 1, pageSize: 10 });
      expect(result.data[0]).toMatchObject({
        name: 'Math Package',
        level: 'SMA',
        isActive: true,
        tutorName: 'Tutor A',
        photo: 'photo.jpg',
        groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
        days: ['Senin']
      });
      expect(result.total).toBe(1);
    });

    it('should use default page=1 and pageSize=8 if not provided', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(0);

      await BimbelPackageService.getActiveBimbelPackages();

      expect(mockPrisma.prisma.bimbelPackage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 8
        })
      );
    });
  });

  describe('getAllBimbelPackages', () => {
    it('should return all bimbel packages with pagination', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          name: 'Math Package',
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }]
        }
      ]);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(1);

      const result = await BimbelPackageService.getAllBimbelPackages({ page: 1, pageSize: 10 });
      expect(result.data[0]).toMatchObject({
        name: 'Math Package',
        tutorName: 'Tutor A',
        photo: 'photo.jpg',
        groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
        days: ['Senin']
      });
      expect(result.total).toBe(1);
    });

    it('should use default page=1 and pageSize=10 if not provided', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(0);

      await BimbelPackageService.getAllBimbelPackages();

      expect(mockPrisma.prisma.bimbelPackage.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10
        })
      );
    });
  });

  describe('getBimbelPackageBySlug', () => {
    it('should return a bimbel package by slug', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Math Package',
        slug: 'math-package',
        isActive: true,
        user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
        groupType: [{ id: 1, type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: [{ day: { daysName: 'Senin' } }]
      });
      const result = await BimbelPackageService.getBimbelPackageBySlug('math-package');
      expect(result).toMatchObject({
        id: 1,
        name: 'Math Package',
        slug: 'math-package',
        tutorName: 'Tutor A',
        photo: 'photo.jpg',
        groupType: [{ id: 1, type: 'privat', price: 100000, discPrice: 90000 }],
        days: ['Senin']
      });
    });

    it('should return null if package is not found', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce(null);
      const result = await BimbelPackageService.getBimbelPackageBySlug('notfound');
      expect(result).toBeNull();
    });

    it('should return status "nonaktif" if package is not active', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 2,
        name: 'Inactive Package',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 60,
        area: 'Jakarta',
        slug: 'inactive-package',
        isActive: false,
        user: { name: 'Tutor B', tutors: [{ photo: 'photo2.jpg' }] },
        groupType: [{ id: 2, type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: [{ day: { daysName: 'Senin' } }]
      });
      const result = await BimbelPackageService.getBimbelPackageBySlug('inactive-package');
      expect(result.status).toBe('nonaktif');
    });
  });

  describe('createBimbelPackage', () => {
    it('should create a new bimbel package', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1' });
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }]);
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce(null);
      mockPrisma.prisma.bimbelPackage.create.mockResolvedValueOnce({ id: 1, name: 'Math Package' });

      const result = await BimbelPackageService.createBimbelPackage({
        name: 'Math Package',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 60,
        area: 'Jakarta',
        tutorId: 'tutor1',
        groupType: [{ type: 'privat', price: 100000 }],
        days: ['Senin'],
        discount: 10
      });
      expect(result.data).toMatchObject({ id: 1, name: 'Math Package' });
    });

    it('should throw an error if tutor is not found', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(
        BimbelPackageService.createBimbelPackage({ tutorId: 'notfound', groupType: [], days: [] })
      ).rejects.toThrow('Tutor (user) tidak ditemukan');
    });

    it('should throw an error if days array is empty', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1' });
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([]);
      await expect(
        BimbelPackageService.createBimbelPackage({
          name: 'Math Package',
          level: 'SMA',
          totalMeetings: 10,
          time: '10:00',
          duration: 60,
          area: 'Jakarta',
          tutorId: 'tutor1',
          groupType: [{ type: 'privat', price: 100000 }],
          days: ['NonexistentDay'],
          discount: 10
        })
      ).rejects.toThrow('Invalid days provided');
    });

    it('should set correct maxStudent for each groupType', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1' });
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }]);
      mockPrisma.prisma.schedule.findUnique.mockResolvedValueOnce(null);
      mockPrisma.prisma.bimbelPackage.create.mockResolvedValueOnce({
        id: 10,
        name: 'Multi Group Package',
        groupType: [
          { type: 'privat', price: 100000, discPrice: 90000, maxStudent: 1 },
          { type: 'grup2', price: 110000, discPrice: 99000, maxStudent: 2 },
          { type: 'grup3', price: 120000, discPrice: 108000, maxStudent: 3 },
          { type: 'grup4', price: 130000, discPrice: 117000, maxStudent: 4 },
          { type: 'grup5', price: 140000, discPrice: 126000, maxStudent: 5 },
          { type: 'custom', price: 150000, discPrice: 135000, maxStudent: 10 }
        ],
        packageDay: [{ day: { id: 1, daysName: 'Senin' } }]
      });

      const result = await BimbelPackageService.createBimbelPackage({
        name: 'Multi Group Package',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 60,
        area: 'Jakarta',
        tutorId: 'tutor1',
        groupType: [
          { type: 'privat', price: 100000 },
          { type: 'grup2', price: 110000 },
          { type: 'grup3', price: 120000 },
          { type: 'grup4', price: 130000 },
          { type: 'grup5', price: 140000 },
          { type: 'custom', price: 150000, maxStudent: 10 }
        ],
        days: ['Senin'],
        discount: 10
      });

      const types = result.data.groupType.map(gt => gt.type);
      const maxStudents = result.data.groupType.map(gt => gt.maxStudent);

      expect(types).toEqual(['privat', 'grup2', 'grup3', 'grup4', 'grup5', 'custom']);
      expect(maxStudents).toEqual([1, 2, 3, 4, 5, 10]);
    });
  });

  describe('createClassBimbelPackage', () => {
    it('should create a new class bimbel package successfully', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1' });
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      mockPrisma.prisma.bimbelPackage.create.mockResolvedValueOnce({
        id: 1,
        name: 'Class Math Package',
        groupType: [{ type: 'kelas', price: 200000, maxStudent: 30 }],
        packageDay: [
          { day: { id: 1, daysName: 'Senin' } },
          { day: { id: 2, daysName: 'Selasa' } }
        ],
        userId: 'tutor1',
        slug: 'class-math-package-sma-xxxxxx',
        isActive: true,
        discount: 0
      });
      mockPrisma.prisma.order.create.mockResolvedValueOnce({ id: 10 });
      mockPrisma.prisma.class.create.mockResolvedValueOnce({ id: 20 });
      mockScheduleService.createSchedules.mockResolvedValueOnce();

      const result = await BimbelPackageService.createClassBimbelPackage({
        name: 'Class Math Package',
        level: 'SMA',
        totalMeetings: 12,
        time: '09:00',
        duration: 90,
        area: 'Jakarta',
        tutorId: 'tutor1',
        groupType: { price: 200000, maxStudent: 30 },
        days: ['Senin', 'Selasa']
      });
      expect(result.data).toHaveProperty('id', 1);
      expect(result.data.days).toContain('Senin');
      expect(result.data.classId).toBe(20);
    });

    it('should throw an error if tutor is not found', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(
        BimbelPackageService.createClassBimbelPackage({
          name: 'Class Math Package',
          tutorId: 'notfound',
          groupType: { price: 200000, maxStudent: 30 },
          days: ['Senin']
        })
      ).rejects.toThrow('Tutor (user) tidak ditemukan');
    });

    it('should throw an error if no valid days are provided', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1' });
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([]);
      await expect(
        BimbelPackageService.createClassBimbelPackage({
          name: 'Class Math Package',
          tutorId: 'tutor1',
          groupType: { price: 200000, maxStudent: 30 },
          days: ['NonexistentDay']
        })
      ).rejects.toThrow('Invalid days provided');
    });

    it('should set discPrice to null if discount is not provided', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 10,
        groupType: [{ id: 100, type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 10,
        name: 'Updated Class Package',
        groupType: [{ id: 100, type: 'kelas', price: 200000, discPrice: null, maxStudent: 20 }],
        packageDay: []
      });

      const result = await BimbelPackageService.updateClassBimbelPackage('slug', {
        name: 'Updated Class Package',
        price: 200000,
        maxStudent: 20
        // discount tidak diberikan
      });
      expect(mockPrisma.prisma.groupType.update).toHaveBeenCalledWith({
        where: { id: 100 },
        data: { price: 200000, discPrice: null, maxStudent: 20 }
      });
      expect(result.data.groupType[0].discPrice).toBeNull();
    });

    it('should set discPrice to null if discount is 0', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 11,
        groupType: [{ id: 101, type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 11,
        name: 'Updated Class Package',
        groupType: [{ id: 101, type: 'kelas', price: 200000, discPrice: null, maxStudent: 20 }],
        packageDay: []
      });

      const result = await BimbelPackageService.updateClassBimbelPackage('slug', {
        name: 'Updated Class Package',
        price: 200000,
        maxStudent: 20,
        discount: 0
      });
      expect(mockPrisma.prisma.groupType.update).toHaveBeenCalledWith({
        where: { id: 101 },
        data: { price: 200000, discPrice: null, maxStudent: 20 }
      });
      expect(result.data.groupType[0].discPrice).toBeNull();
    });

    it('should set discPrice to calculated value if discount > 0 (createClassBimbelPackage)', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1' });
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      mockPrisma.prisma.bimbelPackage.create.mockResolvedValueOnce({
        id: 99,
        name: 'Class Math Package',
        groupType: [{ type: 'kelas', price: 200000, discPrice: 150000, maxStudent: 30 }],
        packageDay: [
          { day: { id: 1, daysName: 'Senin' } },
          { day: { id: 2, daysName: 'Selasa' } }
        ],
        userId: 'tutor1',
        slug: 'class-math-package-sma-xxxxxx',
        isActive: true,
        discount: 25
      });
      mockPrisma.prisma.order.create.mockResolvedValueOnce({ id: 10 });
      mockPrisma.prisma.class.create.mockResolvedValueOnce({ id: 20 });
      mockScheduleService.createSchedules.mockResolvedValueOnce();

      const result = await BimbelPackageService.createClassBimbelPackage({
        name: 'Class Math Package',
        level: 'SMA',
        totalMeetings: 12,
        time: '09:00',
        duration: 90,
        area: 'Jakarta',
        tutorId: 'tutor1',
        price: 200000,
        maxStudent: 30,
        days: ['Senin', 'Selasa'],
        discount: 25
      });
      expect(result.data.groupType[0].discPrice).toBe(150000);
    });

    it('should set discPrice to null if discount is negative', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 12,
        groupType: [{ id: 102, type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 12,
        name: 'Updated Class Package',
        groupType: [{ id: 102, type: 'kelas', price: 200000, discPrice: null, maxStudent: 20 }],
        packageDay: []
      });

      const result = await BimbelPackageService.updateClassBimbelPackage('slug', {
        name: 'Updated Class Package',
        price: 200000,
        maxStudent: 20,
        discount: -10
      });
      expect(mockPrisma.prisma.groupType.update).toHaveBeenCalledWith({
        where: { id: 102 },
        data: { price: 200000, discPrice: null, maxStudent: 20 }
      });
      expect(result.data.groupType[0].discPrice).toBeNull();
    });

    it('should set discPrice to calculated value if discount > 0', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 14,
        groupType: [{ id: 104, type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 14,
        name: 'Updated Class Package',
        groupType: [{ id: 104, type: 'kelas', price: 200000, discPrice: 150000, maxStudent: 20 }],
        packageDay: []
      });

      const result = await BimbelPackageService.updateClassBimbelPackage('slug', {
        name: 'Updated Class Package',
        price: 200000,
        maxStudent: 20,
        discount: 25
      });

      expect(mockPrisma.prisma.groupType.update).toHaveBeenCalledWith({
        where: { id: 104 },
        data: { price: 200000, discPrice: 150000, maxStudent: 20 }
      });
      expect(result.data.groupType[0].discPrice).toBe(150000);
    });

    it('should call packageDay.create for each day if days is provided and dayIds not empty', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 21,
        groupType: [{ id: 201, type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 21,
        name: 'Updated Class Package',
        groupType: [{ id: 201, type: 'kelas', price: 200000, discPrice: null, maxStudent: 20 }],
        packageDay: [
          { day: { id: 1, daysName: 'Senin' } },
          { day: { id: 2, daysName: 'Selasa' } }
        ]
      });

      mockPrisma.prisma.packageDay.deleteMany.mockClear();
      mockPrisma.prisma.packageDay.create.mockClear();

      await BimbelPackageService.updateClassBimbelPackage('slug', {
        name: 'Updated Class Package',
        price: 200000,
        maxStudent: 20,
        days: ['Senin', 'Selasa']
      });

      expect(mockPrisma.prisma.packageDay.deleteMany).toHaveBeenCalledWith({ where: { packageId: 21 } });
      expect(mockPrisma.prisma.day.findMany).toHaveBeenCalledWith({
        where: { daysName: { in: ['Senin', 'Selasa'] } },
        select: { id: true }
      });
      expect(mockPrisma.prisma.packageDay.create).toHaveBeenCalledTimes(2);
    });

    it('should not call packageDay.create if days is provided but dayIds is empty', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 22,
        groupType: [{ id: 202, type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([]);
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 22,
        name: 'Updated Class Package',
        groupType: [{ id: 202, type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }],
        packageDay: []
      });
      mockPrisma.prisma.packageDay.deleteMany.mockClear();
      mockPrisma.prisma.packageDay.create.mockClear();

      await BimbelPackageService.updateClassBimbelPackage('slug', {
        name: 'Updated Class Package',
        price: 200000,
        maxStudent: 20,
        days: ['NonexistentDay']
      });

      expect(mockPrisma.prisma.packageDay.deleteMany).toHaveBeenCalledWith({ where: { packageId: 22 } });
      expect(mockPrisma.prisma.day.findMany).toHaveBeenCalledWith({
        where: { daysName: { in: ['NonexistentDay'] } },
        select: { id: true }
      });
      expect(mockPrisma.prisma.packageDay.create).not.toHaveBeenCalled();
    });

    it('should not call deleteMany, findMany, or create if days is not provided', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 23,
        groupType: [{ id: 203, type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 23,
        name: 'Updated Class Package',
        groupType: [{ id: 203, type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }],
        packageDay: []
      });
      mockPrisma.prisma.packageDay.deleteMany.mockClear();
      mockPrisma.prisma.day.findMany.mockClear();
      mockPrisma.prisma.packageDay.create.mockClear();

      await BimbelPackageService.updateClassBimbelPackage('slug', {
        name: 'Updated Class Package',
        price: 200000,
        maxStudent: 20
        // days tidak diberikan
      });

      expect(mockPrisma.prisma.packageDay.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.prisma.day.findMany).not.toHaveBeenCalled();
      expect(mockPrisma.prisma.packageDay.create).not.toHaveBeenCalled();
    });
  });

  describe('updateBimbelPackage', () => {
    it('should throw an error if package not found', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce(null);
      await expect(
        BimbelPackageService.updateBimbelPackage('notfound', { name: 'A' })
      ).rejects.toThrow('Package not found');
    });

    it('should set discPrice to null if discount is not provided', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 2,
        groupType: [{ id: 10, type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.findMany.mockResolvedValueOnce([
        { id: 10, type: 'privat', price: 100000, discPrice: 90000 }
      ]);
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 2,
        name: 'Updated Package',
        groupType: [{ id: 10, type: 'privat', price: 120000, discPrice: null }],
        packageDay: []
      });

      const result = await BimbelPackageService.updateBimbelPackage('slug', {
        name: 'Updated Package',
        groupType: [{ type: 'privat', price: 120000 }]
        // discount tidak diberikan
      });
      expect(mockPrisma.prisma.groupType.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: { price: 120000, discPrice: null }
      });
      expect(result.data.groupType[0].discPrice).toBeNull();
    });

    it('should set discPrice to null if discount is 0', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 3,
        groupType: [{ id: 11, type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.findMany.mockResolvedValueOnce([
        { id: 11, type: 'privat', price: 100000, discPrice: 90000 }
      ]);
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 3,
        name: 'Updated Package',
        groupType: [{ id: 11, type: 'privat', price: 120000, discPrice: null }],
        packageDay: []
      });

      const result = await BimbelPackageService.updateBimbelPackage('slug', {
        name: 'Updated Package',
        groupType: [{ type: 'privat', price: 120000 }],
        discount: 0
      });
      expect(mockPrisma.prisma.groupType.update).toHaveBeenCalledWith({
        where: { id: 11 },
        data: { price: 120000, discPrice: null }
      });
      expect(result.data.groupType[0].discPrice).toBeNull();
    });

    it('should set discPrice to null if discount is negative', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 4,
        groupType: [{ id: 12, type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.findMany.mockResolvedValueOnce([
        { id: 12, type: 'privat', price: 100000, discPrice: 90000 }
      ]);
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 4,
        name: 'Updated Package',
        groupType: [{ id: 12, type: 'privat', price: 120000, discPrice: null }],
        packageDay: []
      });

      const result = await BimbelPackageService.updateBimbelPackage('slug', {
        name: 'Updated Package',
        groupType: [{ type: 'privat', price: 120000 }],
        discount: -10
      });
      expect(mockPrisma.prisma.groupType.update).toHaveBeenCalledWith({
        where: { id: 12 },
        data: { price: 120000, discPrice: null }
      });
      expect(result.data.groupType[0].discPrice).toBeNull();
    });

    it('should set discPrice to calculated value if discount > 0', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 5,
        groupType: [{ id: 13, type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.findMany.mockResolvedValueOnce([
        { id: 13, type: 'privat', price: 100000, discPrice: 90000 }
      ]);
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 5,
        name: 'Updated Package',
        groupType: [{ id: 13, type: 'privat', price: 120000, discPrice: 90000 }],
        packageDay: []
      });

      const result = await BimbelPackageService.updateBimbelPackage('slug', {
        name: 'Updated Package',
        groupType: [{ type: 'privat', price: 120000 }],
        discount: 25
      });
      expect(mockPrisma.prisma.groupType.update).toHaveBeenCalledWith({
        where: { id: 13 },
        data: { price: 120000, discPrice: 90000 }
      });
      expect(result.data.groupType[0].discPrice).toBe(90000);
    });

    it('should call deleteMany, findMany, and create for each day if days is provided', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 100,
        groupType: [],
        packageDay: []
      });
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 100,
        name: 'Updated Package',
        groupType: [],
        packageDay: [
          { day: { daysName: 'Senin' } },
          { day: { daysName: 'Selasa' } }
        ]
      });
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      mockPrisma.prisma.packageDay.deleteMany.mockClear();
      mockPrisma.prisma.packageDay.create.mockClear();

      await BimbelPackageService.updateBimbelPackage('slug', {
        name: 'Updated Package',
        days: ['Senin', 'Selasa']
      });

      expect(mockPrisma.prisma.packageDay.deleteMany).toHaveBeenCalledWith({ where: { packageId: 100 } });
      expect(mockPrisma.prisma.day.findMany).toHaveBeenCalledWith({
        where: { daysName: { in: ['Senin', 'Selasa'] } },
        select: { id: true }
      });
      expect(mockPrisma.prisma.packageDay.create).toHaveBeenCalledTimes(2);
    });

    it('should not call packageDay.create if dayIds is empty', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 101,
        groupType: [],
        packageDay: []
      });
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 101,
        name: 'Updated Package',
        groupType: [],
        packageDay: []
      });
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([]);
      mockPrisma.prisma.packageDay.deleteMany.mockClear();
      mockPrisma.prisma.packageDay.create.mockClear();

      await BimbelPackageService.updateBimbelPackage('slug', {
        name: 'Updated Package',
        days: ['NonexistentDay']
      });

      expect(mockPrisma.prisma.packageDay.deleteMany).toHaveBeenCalledWith({ where: { packageId: 101 } });
      expect(mockPrisma.prisma.day.findMany).toHaveBeenCalledWith({
        where: { daysName: { in: ['NonexistentDay'] } },
        select: { id: true }
      });
      expect(mockPrisma.prisma.packageDay.create).not.toHaveBeenCalled();
    });

    it('should not call deleteMany, findMany, or create if days is not provided', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 102,
        groupType: [],
        packageDay: []
      });
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 102,
        name: 'Updated Package',
        groupType: [],
        packageDay: []
      });
      mockPrisma.prisma.packageDay.deleteMany.mockClear();
      mockPrisma.prisma.day.findMany.mockClear();
      mockPrisma.prisma.packageDay.create.mockClear();

      await BimbelPackageService.updateBimbelPackage('slug', {
        name: 'Updated Package'
        // days tidak diberikan
      });

      expect(mockPrisma.prisma.packageDay.deleteMany).not.toHaveBeenCalled();
      expect(mockPrisma.prisma.day.findMany).not.toHaveBeenCalled();
      expect(mockPrisma.prisma.packageDay.create).not.toHaveBeenCalled();
    });
  });

  describe('updateClassBimbelPackage', () => {
    it('should throw an error if package not found', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce(null);
      await expect(
        BimbelPackageService.updateClassBimbelPackage('notfound', { name: 'A' })
      ).rejects.toThrow('Package not found');
    });
    it('should call deleteMany, findMany, and create for each day if days is provided', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 21,
        groupType: [{ id: 201, type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }],
        packageDay: []
      });
      mockPrisma.prisma.groupType.update.mockResolvedValueOnce({});
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 21,
        name: 'Updated Class Package',
        groupType: [{ id: 201, type: 'kelas', price: 200000, discPrice: null, maxStudent: 20 }],
        packageDay: [
          { day: { id: 1, daysName: 'Senin' } },
          { day: { id: 2, daysName: 'Selasa' } }
        ]
      });

      mockPrisma.prisma.packageDay.deleteMany.mockClear();
      mockPrisma.prisma.packageDay.create.mockClear();

      const result = await BimbelPackageService.updateClassBimbelPackage('slug', {
        name: 'Updated Class Package',
        price: 200000,
        maxStudent: 20,
        days: ['Senin', 'Selasa']
      });

      expect(mockPrisma.prisma.packageDay.deleteMany).toHaveBeenCalledWith({ where: { packageId: 21 } });
      expect(mockPrisma.prisma.day.findMany).toHaveBeenCalledWith({
        where: { daysName: { in: ['Senin', 'Selasa'] } },
        select: { id: true }
      });
      // Harus dipanggil dua kali, satu untuk tiap hari
      expect(mockPrisma.prisma.packageDay.create).toHaveBeenCalledTimes(2);
      expect(result.data.days).toContain('Senin');
      expect(result.data.days).toContain('Selasa');
    });
  });

  describe('deleteBimbelPackage', () => {
    it('should soft delete a bimbel package', async () => {
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({});
      const result = await BimbelPackageService.deleteBimbelPackage('slug');
      expect(result).toEqual({ message: 'Bimbel package soft deleted successfully' });
    });
  });

  describe('updateBimbelPackageStatus', () => {
    it('should update isActive to true if all schedules have attendances', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          schedules: [{ attendances: [{}] }],
          order: { bimbelPackage: { id: 1 } }
        }
      ]);
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({});
      const result = await BimbelPackageService.updateBimbelPackageStatus();
      expect(mockPrisma.prisma.bimbelPackage.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: true }
      });
      expect(result).toEqual({ message: 'Bimbel package status updated successfully' });
    });
    it('should not update if not all schedules have attendances', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          schedules: [{ attendances: [{}] }, { attendances: [] }], // satu jadwal tanpa attendance
          order: { bimbelPackage: { id: 1 } }
        }
      ]);
      mockPrisma.prisma.bimbelPackage.update.mockClear();

      const result = await BimbelPackageService.updateBimbelPackageStatus();
      expect(mockPrisma.prisma.bimbelPackage.update).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'Bimbel package status updated successfully' });
    });

    it('should not update if order or bimbelPackage is missing', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          schedules: [{ attendances: [{}] }],
          order: null // order tidak ada
        },
        {
          schedules: [{ attendances: [{}] }],
          order: { bimbelPackage: null } // bimbelPackage tidak ada
        }
      ]);
      mockPrisma.prisma.bimbelPackage.update.mockClear();

      const result = await BimbelPackageService.updateBimbelPackageStatus();
      expect(mockPrisma.prisma.bimbelPackage.update).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'Bimbel package status updated successfully' });
    });
  });

  describe('getBimbelPackagesByPopularity', () => {
    it('should return bimbel packages sorted by popularity', async () => {
      mockPrisma.prisma.order.groupBy.mockResolvedValueOnce([
        { packageId: 1, _count: { packageId: 5 } },
        { packageId: 2, _count: { packageId: 10 } },
        { packageId: 3, _count: { packageId: 0 } }
      ]);
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Math Package',
          isActive: true,
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }]
        },
        {
          id: 2,
          name: 'Fisika',
          isActive: true,
          user: { name: 'Tutor B', tutors: [{ photo: 'photo2.jpg' }] },
          groupType: [{ type: 'kelompok', price: 120000, discPrice: 110000 }],
          packageDay: [{ day: { daysName: 'Selasa' } }]
        },
        {
          id: 3,
          name: 'Kimia',
          isActive: true,
          user: { name: 'Tutor C', tutors: [{ photo: 'photo3.jpg' }] },
          groupType: [{ type: 'kelompok', price: 90000, discPrice: 80000 }],
          packageDay: [{ day: { daysName: 'Rabu' } }]
        }
      ]);
      const result = await BimbelPackageService.getBimbelPackagesByPopularity();
      expect(result[0].name).toBe('Fisika'); // orderCount 10
      expect(result[1].name).toBe('Math Package'); // orderCount 5
      expect(result[2].name).toBe('Kimia'); // orderCount 0
      expect(result[0].orderCount).toBe(10);
      expect(result[2].orderCount).toBe(0);
    });

    it('should keep order if orderCount is the same', async () => {
      mockPrisma.prisma.order.groupBy.mockResolvedValueOnce([
        { packageId: 1, _count: { packageId: 2 } },
        { packageId: 2, _count: { packageId: 2 } }
      ]);
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Math Package',
          isActive: true,
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }]
        },
        {
          id: 2,
          name: 'Fisika',
          isActive: true,
          user: { name: 'Tutor B', tutors: [{ photo: 'photo2.jpg' }] },
          groupType: [{ type: 'kelompok', price: 120000, discPrice: 110000 }],
          packageDay: [{ day: { daysName: 'Selasa' } }]
        }
      ]);
      const result = await BimbelPackageService.getBimbelPackagesByPopularity();
      expect(result[0].name).toBe('Math Package');
      expect(result[1].name).toBe('Fisika');
      expect(result[0].orderCount).toBe(2);
      expect(result[1].orderCount).toBe(2);
    });

    it('should return empty array if no packages found', async () => {
      mockPrisma.prisma.order.groupBy.mockResolvedValueOnce([]);
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
      const result = await BimbelPackageService.getBimbelPackagesByPopularity();
      expect(result).toEqual([]);
    });

    it('should set orderCount to 0 if package has no orders', async () => {
      mockPrisma.prisma.order.groupBy.mockResolvedValueOnce([
        { packageId: 1, _count: { packageId: 5 } }
      ]);
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Math Package',
          isActive: true,
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }]
        },
        {
          id: 2,
          name: 'Kimia',
          isActive: true,
          user: { name: 'Tutor B', tutors: [{ photo: 'photo2.jpg' }] },
          groupType: [{ type: 'kelompok', price: 120000, discPrice: 110000 }],
          packageDay: [{ day: { daysName: 'Selasa' } }]
        }
      ]);
      const result = await BimbelPackageService.getBimbelPackagesByPopularity();
      // Math Package ada orderCount, Kimia tidak ada orderCountEntry
      expect(result.find(pkg => pkg.name === 'Math Package').orderCount).toBe(5);
      expect(result.find(pkg => pkg.name === 'Kimia').orderCount).toBe(0);
    });
  });

  describe('getRunningPrograms', () => {
    it('should return running programs with classId, tutorName, and bimbelPackageName', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          id: 1,
          status: 'berjalan',
          tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] },
          order: { bimbelPackage: { name: 'Math Package' } }
        }
      ]);
      const result = await BimbelPackageService.getRunningPrograms();
      expect(result[0]).toMatchObject({
        classId: 1,
        tutorName: 'Pak Tutor A',
        bimbelPackageName: 'Math Package'
      });
    });

    it('should return tutorName with Pak if gender is Male', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          id: 1,
          status: 'berjalan',
          tutor: { name: 'Budi', tutors: [{ gender: 'Male' }] },
          order: { bimbelPackage: { name: 'Math Package' } }
        }
      ]);
      const result = await BimbelPackageService.getRunningPrograms();
      expect(result[0].tutorName).toBe('Pak Budi');
      expect(result[0].bimbelPackageName).toBe('Math Package');
    });

    it('should return tutorName with Bu if gender is not Male', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          id: 2,
          status: 'berjalan',
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] },
          order: { bimbelPackage: { name: 'Fisika' } }
        }
      ]);
      const result = await BimbelPackageService.getRunningPrograms();
      expect(result[0].tutorName).toBe('Bu Siti');
      expect(result[0].bimbelPackageName).toBe('Fisika');
    });

    it('should return tutorName as null if tutor is missing', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          id: 3,
          status: 'berjalan',
          tutor: null,
          order: { bimbelPackage: { name: 'Kimia' } }
        }
      ]);
      const result = await BimbelPackageService.getRunningPrograms();
      expect(result[0].tutorName).toBeNull();
      expect(result[0].bimbelPackageName).toBe('Kimia');
    });

    it('should return bimbelPackageName as null if order or bimbelPackage is missing', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          id: 4,
          status: 'berjalan',
          tutor: { name: 'Budi', tutors: [{ gender: 'Male' }] },
          order: null
        },
        {
          id: 5,
          status: 'berjalan',
          tutor: { name: 'Siti', tutors: [{ gender: 'Female' }] },
          order: { bimbelPackage: null }
        }
      ]);
      const result = await BimbelPackageService.getRunningPrograms();
      expect(result[0].bimbelPackageName).toBeNull();
      expect(result[1].bimbelPackageName).toBeNull();
    });
  });

  describe('getMyPackages', () => {
    it('should return bimbel packages for the logged-in tutor', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Math Package',
          isActive: true,
          user: { tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }]
        }
      ]);
      const result = await BimbelPackageService.getMyPackages({ id: 'tutor1', role: 'tutor' });
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'Math Package',
        isActive: true,
        photo: 'photo.jpg',
        groupType: [{ type: 'privat', price: 90000, discPrice: 81000 }],
        days: ['Senin']
      });
    });

    it('should throw an error if user is not a tutor', async () => {
      await expect(
        BimbelPackageService.getMyPackages({ id: 'user1', role: 'siswa' })
      ).rejects.toThrow('Only tutors can access this resource');
    });

    it('should set photo to null if tutors array is empty', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 2,
          name: 'No Tutor',
          isActive: true,
          user: { tutors: [] }, 
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: []
        }
      ]);
      const result = await BimbelPackageService.getMyPackages({ id: 'tutor2', role: 'tutor' });
      expect(result[0].photo).toBeNull();
    });

    it('should set photo to null if tutors[0].photo is undefined', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 3,
          name: 'Tutor No Photo',
          isActive: true,
          user: { tutors: [{}] }, // tutors[0].photo undefined
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: []
        }
      ]);
      const result = await BimbelPackageService.getMyPackages({ id: 'tutor3', role: 'tutor' });
      expect(result[0].photo).toBeNull();
    });

    it('should set discPrice to null if original discPrice is null', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 4,
          name: 'No DiscPrice',
          isActive: true,
          user: { tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: null }],
          packageDay: []
        }
      ]);
      const result = await BimbelPackageService.getMyPackages({ id: 'tutor4', role: 'tutor' });
      expect(result[0].groupType[0].discPrice).toBeNull();
    });

    it('should multiply price and discPrice by 0.9 if discPrice is not null', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 5,
          name: 'With DiscPrice',
          isActive: true,
          user: { tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 200000, discPrice: 100000 }],
          packageDay: []
        }
      ]);
      const result = await BimbelPackageService.getMyPackages({ id: 'tutor5', role: 'tutor' });
      expect(result[0].groupType[0].price).toBe(180000);
      expect(result[0].groupType[0].discPrice).toBe(90000);
    });
  });

  describe('getMyPackageBySlug', () => {
    it('should return the bimbel package for the logged-in tutor by slug', async () => {
      mockPrisma.prisma.bimbelPackage.findFirst.mockResolvedValueOnce({
        id: 1,
        name: 'Math Package',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 60,
        area: 'Jakarta',
        slug: 'math-package',
        groupType: [
          { type: 'privat', price: 100000, discPrice: 90000 }
        ],
        packageDay: [
          { day: { daysName: 'Senin' } },
          { day: { daysName: 'Selasa' } }
        ]
      });
      const result = await BimbelPackageService.getMyPackageBySlug('math-package', { id: 'tutor1', role: 'tutor' });
      expect(result).toMatchObject({
        id: 1,
        name: 'Math Package',
        slug: 'math-package',
        groupType: [
          { type: 'privat', price: 90000, discPrice: 81000 }
        ],
        days: ['Senin', 'Selasa']
      });
    });

    it('should return null if the package is not found for the tutor', async () => {
      mockPrisma.prisma.bimbelPackage.findFirst.mockResolvedValueOnce(null);
      const result = await BimbelPackageService.getMyPackageBySlug('notfound', { id: 'tutor1', role: 'tutor' });
      expect(result).toBeNull();
    });

    it('should throw an error if user is not a tutor', async () => {
      await expect(
        BimbelPackageService.getMyPackageBySlug('math-package', { id: 'user1', role: 'siswa' })
      ).rejects.toThrow('Only tutors can access this resource');
    });

    it('should set discPrice to null if original discPrice is null', async () => {
      mockPrisma.prisma.bimbelPackage.findFirst.mockResolvedValueOnce({
        id: 2,
        name: 'No DiscPrice',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 60,
        area: 'Jakarta',
        slug: 'no-discprice',
        groupType: [
          { type: 'privat', price: 100000, discPrice: null }
        ],
        packageDay: [
          { day: { daysName: 'Senin' } }
        ]
      });
      const result = await BimbelPackageService.getMyPackageBySlug('no-discprice', { id: 'tutor1', role: 'tutor' });
      expect(result.groupType[0].discPrice).toBeNull();
    });

    it('should multiply discPrice by 0.9 if discPrice is not null', async () => {
      mockPrisma.prisma.bimbelPackage.findFirst.mockResolvedValueOnce({
        id: 3,
        name: 'With DiscPrice',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 60,
        area: 'Jakarta',
        slug: 'with-discprice',
        groupType: [
          { type: 'privat', price: 200000, discPrice: 100000 }
        ],
        packageDay: [
          { day: { daysName: 'Senin' } }
        ]
      });
      const result = await BimbelPackageService.getMyPackageBySlug('with-discprice', { id: 'tutor1', role: 'tutor' });
      expect(result.groupType[0].discPrice).toBe(90000);
    });
  });

  describe('getBimbelPackageStatistics', () => {
    it('should return bimbel package statistics', async () => {
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(10);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(8);
      const result = await BimbelPackageService.getBimbelPackageStatistics();
      expect(result).toEqual({
        totalPackages: 10,
        activePackages: 8,
        inactivePackages: 2
      });
    });
  });

  describe('getMyProgramsStatistics', () => {
    it('should return statistics for a student', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ role: 'siswa' });
      mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
        { class: { status: 'berjalan' } },
        { class: { status: 'selesai' } }
      ]);
      const result = await BimbelPackageService.getMyProgramsStatistics('student1');
      expect(result).toEqual({
        runningClasses: 1,
        completedClasses: 1
      });
    });

    it('should return statistics for a tutor', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ role: 'tutor' });
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        { status: 'berjalan' },
        { status: 'selesai' }
      ]);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(5);
      const result = await BimbelPackageService.getMyProgramsStatistics('tutor1');
      expect(result).toEqual({
        runningClasses: 1,
        completedClasses: 1,
        activePackages: 5
      });
    });

    it('should throw an error if user not found', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(BimbelPackageService.getMyProgramsStatistics('notfound')).rejects.toThrow('User not found');
    });

    it('should throw an error if role is not supported', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ role: 'admin' });
      await expect(BimbelPackageService.getMyProgramsStatistics('admin1')).rejects.toThrow('Role not supported for this operation');
    });
  });

  describe('getRecommendations', () => {
    it('should return recommended bimbel packages for a student, sorted and limited', async () => {
      const user = { id: 'student1', role: 'siswa' };
      mockPrisma.prisma.student.findUnique.mockResolvedValueOnce({ level: 'SMA' });
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Math Package',
          level: 'SMA',
          totalMeetings: 10,
          time: '10:00',
          duration: 60,
          area: 'Jakarta',
          slug: 'math-package',
          isActive: true,
          user: { name: 'Tutor A', tutors: [{ photo: 'photo1.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }],
          orders: [{}, {}, {}]
        },
        {
          id: 2,
          name: 'Physics Package',
          level: 'SMA',
          totalMeetings: 8,
          time: '12:00',
          duration: 60,
          area: 'Bandung',
          slug: 'physics-package',
          isActive: true,
          user: { name: 'Tutor B', tutors: [{ photo: 'photo2.jpg' }] },
          groupType: [{ type: 'kelompok', price: 120000, discPrice: 110000 }],
          packageDay: [{ day: { daysName: 'Selasa' } }],
          orders: [{}]
        }
      ]);
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result.length).toBeLessThanOrEqual(4);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('orderCount');
    });

    it('should return null if user is not a student', async () => {
      const user = { id: 'tutor1', role: 'tutor' };
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result).toBeNull();
    });

    it('should return null if student is not found', async () => {
      const user = { id: 'student2', role: 'siswa' };
      mockPrisma.prisma.student.findUnique.mockResolvedValueOnce(null);
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result).toBeNull();
    });

    it('should return an empty array if no recommended packages found', async () => {
      const user = { id: 'student3', role: 'siswa' };
      mockPrisma.prisma.student.findUnique.mockResolvedValueOnce({ level: 'SMP' });
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result).toEqual([]);
    });

    it('should sort packages with hasDiscPrice true before false', async () => {
      const user = { id: 'student4', role: 'siswa' };
      mockPrisma.prisma.student.findUnique.mockResolvedValueOnce({ level: 'SMA' });
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Paket Diskon',
          level: 'SMA',
          totalMeetings: 10,
          time: '10:00',
          duration: 60,
          area: 'Jakarta',
          slug: 'paket-diskon',
          isActive: true,
          user: { name: 'Tutor Diskon', tutors: [{ photo: 'photo1.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }], // hasDiscPrice: true
          packageDay: [{ day: { daysName: 'Senin' } }],
          orders: [{}, {}]
        },
        {
          id: 2,
          name: 'Paket Tanpa Diskon',
          level: 'SMA',
          totalMeetings: 8,
          time: '12:00',
          duration: 60,
          area: 'Bandung',
          slug: 'paket-tanpa-diskon',
          isActive: true,
          user: { name: 'Tutor Biasa', tutors: [{ photo: 'photo2.jpg' }] },
          groupType: [{ type: 'privat', price: 120000, discPrice: null }], // hasDiscPrice: false
          packageDay: [{ day: { daysName: 'Selasa' } }],
          orders: [{}]
        }
      ]);
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result[0].name).toBe('Paket Diskon');
      expect(result[1].name).toBe('Paket Tanpa Diskon');
    });

    it('should sort by orderCount ascending if hasDiscPrice is equal', async () => {
      const user = { id: 'student5', role: 'siswa' };
      mockPrisma.prisma.student.findUnique.mockResolvedValueOnce({ level: 'SMA' });
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Paket A',
          level: 'SMA',
          totalMeetings: 10,
          time: '10:00',
          duration: 60,
          area: 'Jakarta',
          slug: 'paket-a',
          isActive: true,
          user: { name: 'Tutor A', tutors: [{ photo: 'photo1.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: null }], // hasDiscPrice: false
          packageDay: [{ day: { daysName: 'Senin' } }],
          orders: [{}, {}, {}] // orderCount: 3
        },
        {
          id: 2,
          name: 'Paket B',
          level: 'SMA',
          totalMeetings: 8,
          time: '12:00',
          duration: 60,
          area: 'Bandung',
          slug: 'paket-b',
          isActive: true,
          user: { name: 'Tutor B', tutors: [{ photo: 'photo2.jpg' }] },
          groupType: [{ type: 'privat', price: 120000, discPrice: null }], // hasDiscPrice: false
          packageDay: [{ day: { daysName: 'Selasa' } }],
          orders: [{}] // orderCount: 1
        }
      ]);
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result[0].name).toBe('Paket B'); // orderCount lebih kecil
      expect(result[1].name).toBe('Paket A');
    });

    it('should sort packages with hasDiscPrice false after true (reverse order)', async () => {
      const user = { id: 'student6', role: 'siswa' };
      mockPrisma.prisma.student.findUnique.mockResolvedValueOnce({ level: 'SMA' });
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Tanpa Diskon',
          level: 'SMA',
          totalMeetings: 10,
          time: '10:00',
          duration: 60,
          area: 'Jakarta',
          slug: 'tanpa-diskon',
          isActive: true,
          user: { name: 'Tutor Biasa', tutors: [{ photo: 'photo1.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: null }],
          packageDay: [{ day: { daysName: 'Senin' } }],
          orders: [{}, {}]
        },
        {
          id: 2,
          name: 'Dengan Diskon',
          level: 'SMA',
          totalMeetings: 8,
          time: '12:00',
          duration: 60,
          area: 'Bandung',
          slug: 'dengan-diskon',
          isActive: true,
          user: { name: 'Tutor Diskon', tutors: [{ photo: 'photo2.jpg' }] },
          groupType: [{ type: 'privat', price: 120000, discPrice: 110000 }],
          packageDay: [{ day: { daysName: 'Selasa' } }],
          orders: [{}]
        }
      ]);
      const result = await BimbelPackageService.getRecommendations(user);
      // Dengan Diskon harus di depan Tanpa Diskon
      expect(result[0].name).toBe('Dengan Diskon');
      expect(result[1].name).toBe('Tanpa Diskon');
    });
    it('should set photo to null if tutors array is empty', async () => {
      const user = { id: 'student7', role: 'siswa' };
      mockPrisma.prisma.student.findUnique.mockResolvedValueOnce({ level: 'SMA' });
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Tanpa Tutor',
          level: 'SMA',
          totalMeetings: 10,
          time: '10:00',
          duration: 60,
          area: 'Jakarta',
          slug: 'tanpa-tutor',
          isActive: true,
          user: { name: 'Tutor Kosong', tutors: [] }, // tutors kosong
          groupType: [{ type: 'privat', price: 100000, discPrice: null }],
          packageDay: [{ day: { daysName: 'Senin' } }],
          orders: []
        }
      ]);
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result[0].photo).toBeNull();
    });

    it('should set photo to null if tutors[0].photo is undefined', async () => {
      const user = { id: 'student8', role: 'siswa' };
      mockPrisma.prisma.student.findUnique.mockResolvedValueOnce({ level: 'SMA' });
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 2,
          name: 'Tutor Tanpa Foto',
          level: 'SMA',
          totalMeetings: 10,
          time: '10:00',
          duration: 60,
          area: 'Jakarta',
          slug: 'tutor-tanpa-foto',
          isActive: true,
          user: { name: 'Tutor Tanpa Foto', tutors: [{}] }, // tutors[0].photo undefined
          groupType: [{ type: 'privat', price: 100000, discPrice: null }],
          packageDay: [{ day: { daysName: 'Senin' } }],
          orders: []
        }
      ]);
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result[0].photo).toBeNull();
    });
  });

  describe('getFilteredBimbelPackages', () => {
    it('should return all packages if no filter is given', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          name: 'Math Package',
          level: 'SMA',
          totalMeetings: 10,
          time: '10:00',
          duration: 60,
          area: 'Jakarta',
          slug: 'math-package',
          isActive: true,
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }]
        }
      ]);
      const result = await BimbelPackageService.getFilteredBimbelPackages();
      expect(result[0]).toMatchObject({
        name: 'Math Package',
        level: 'SMA',
        tutorName: 'Tutor A',
        days: ['Senin']
      });
    });

    it('should filter by searchText (package name)', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          name: 'Fisika',
          level: 'SMA',
          totalMeetings: 8,
          time: '09:00',
          duration: 60,
          area: 'Bandung',
          slug: 'fisika',
          isActive: true,
          user: { name: 'Tutor B', tutors: [{ photo: 'photo2.jpg' }] },
          groupType: [{ type: 'privat', price: 120000, discPrice: 110000 }],
          packageDay: [{ day: { daysName: 'Selasa' } }]
        }
      ]);
      const result = await BimbelPackageService.getFilteredBimbelPackages({ searchText: 'Fisika' });
      expect(result[0].name).toBe('Fisika');
    });

    it('should filter by searchText (tutor name)', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          name: 'Kimia',
          level: 'SMA',
          totalMeetings: 8,
          time: '09:00',
          duration: 60,
          area: 'Bandung',
          slug: 'kimia',
          isActive: true,
          user: { name: 'Tutor C', tutors: [{ photo: 'photo3.jpg' }] },
          groupType: [{ type: 'privat', price: 120000, discPrice: 110000 }],
          packageDay: [{ day: { daysName: 'Rabu' } }]
        }
      ]);
      const result = await BimbelPackageService.getFilteredBimbelPackages({ searchText: 'Tutor C' });
      expect(result[0].tutorName).toBe('Tutor C');
    });

    it('should filter by level', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          name: 'Biologi',
          level: 'SMP',
          totalMeetings: 6,
          time: '08:00',
          duration: 60,
          area: 'Depok',
          slug: 'biologi',
          isActive: true,
          user: { name: 'Tutor D', tutors: [{ photo: 'photo4.jpg' }] },
          groupType: [{ type: 'privat', price: 90000, discPrice: 85000 }],
          packageDay: [{ day: { daysName: 'Kamis' } }]
        }
      ]);
      const result = await BimbelPackageService.getFilteredBimbelPackages({ level: 'SMP' });
      expect(result[0].level).toBe('SMP');
    });

    it('should filter by durasi', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          name: 'Bahasa Inggris',
          level: 'SMA',
          totalMeetings: 12,
          time: '13:00',
          duration: 90,
          area: 'Jakarta',
          slug: 'b-inggris',
          isActive: true,
          user: { name: 'Tutor E', tutors: [{ photo: 'photo5.jpg' }] },
          groupType: [{ type: 'privat', price: 150000, discPrice: 140000 }],
          packageDay: [{ day: { daysName: 'Jumat' } }]
        }
      ]);
      const result = await BimbelPackageService.getFilteredBimbelPackages({ durasi: 90 });
      expect(result[0].duration).toBe(90);
    });

    it('should filter by hari', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          name: 'Matematika',
          level: 'SD',
          totalMeetings: 5,
          time: '15:00',
          duration: 45,
          area: 'Bekasi',
          slug: 'matematika',
          isActive: true,
          user: { name: 'Tutor F', tutors: [{ photo: 'photo6.jpg' }] },
          groupType: [{ type: 'privat', price: 70000, discPrice: 65000 }],
          packageDay: [{ day: { daysName: 'Sabtu' } }]
        }
      ]);
      const result = await BimbelPackageService.getFilteredBimbelPackages({ hari: ['Sabtu'] });
      expect(result[0].days).toContain('Sabtu');
    });

    it('should filter by all filters combined', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          name: 'Matematika SMA',
          level: 'SMA',
          totalMeetings: 10,
          time: '10:00',
          duration: 60,
          area: 'Jakarta',
          slug: 'matematika-sma',
          isActive: true,
          user: { name: 'Tutor G', tutors: [{ photo: 'photo7.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }]
        }
      ]);
      const result = await BimbelPackageService.getFilteredBimbelPackages({
        searchText: 'Matematika',
        level: 'SMA',
        hari: ['Senin'],
        durasi: 60
      });
      expect(result[0].name).toBe('Matematika SMA');
      expect(result[0].level).toBe('SMA');
      expect(result[0].days).toContain('Senin');
      expect(result[0].duration).toBe(60);
    });

    it('should return empty array if no packages found', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
      const result = await BimbelPackageService.getFilteredBimbelPackages({ searchText: 'TidakAda' });
      expect(result).toEqual([]);
    });
  });

  describe('getBimbelPackagesByUserId', () => {
    it('should return all bimbel packages for a tutor', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Math Package',
          level: 'SMA',
          time: '10:00',
          duration: 60,
          slug: 'math-package',
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }]
        },
        {
          id: 2,
          name: 'Fisika',
          level: 'SMP',
          time: '12:00',
          duration: 90,
          slug: 'fisika',
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'kelompok', price: 120000, discPrice: 110000 }],
          packageDay: [{ day: { daysName: 'Selasa' } }]
        }
      ]);
      const result = await BimbelPackageService.getBimbelPackagesByUserId('tutor1');
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'Math Package',
        tutorName: 'Tutor A',
        groupType: [{ type: 'privat' }],
        days: ['Senin']
      });
      expect(result[1]).toMatchObject({
        id: 2,
        name: 'Fisika',
        groupType: [{ type: 'kelompok' }],
        days: ['Selasa']
      });
    });

    it('should return empty array if tutor has no packages', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
      const result = await BimbelPackageService.getBimbelPackagesByUserId('tutor2');
      expect(result).toEqual([]);
    });
  });
});