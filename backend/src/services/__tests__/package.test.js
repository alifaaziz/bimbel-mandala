import { jest } from '@jest/globals';
import { generatePrismaMock } from '../../utils/jest.js';

const mockPrisma = generatePrismaMock();

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: mockPrisma.prisma,
}));

const { BimbelPackageService } = await import('../package.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('BimbelPackageService', () => {
  describe('getActiveBimbelPackages', () => {
    it('should return active bimbel packages with pagination', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        { id: 1, name: 'Math Package', isActive: true },
      ]);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(1);

      const result = await BimbelPackageService.getActiveBimbelPackages({ page: 1, pageSize: 10 });

      expect(mockPrisma.prisma.bimbelPackage.findMany).toHaveBeenCalledWith(expect.any(Object));
      expect(mockPrisma.prisma.bimbelPackage.count).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({
        data: [{ id: 1, name: 'Math Package', isActive: true }],
        total: 1,
        page: 1,
        pageSize: 10,
      });
    });
  });

  describe('getAllBimbelPackages', () => {
    it('should return all bimbel packages with pagination', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        { id: 1, name: 'Math Package' },
      ]);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(1);

      const result = await BimbelPackageService.getAllBimbelPackages({ page: 1, pageSize: 10 });

      expect(mockPrisma.prisma.bimbelPackage.findMany).toHaveBeenCalledWith(expect.any(Object));
      expect(mockPrisma.prisma.bimbelPackage.count).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({
        data: [{ id: 1, name: 'Math Package' }],
        total: 1,
        page: 1,
        pageSize: 10,
      });
    });
  });

  describe('getBimbelPackageBySlug', () => {
    it('should return a bimbel package by slug', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Math Package',
        slug: 'math-package',
      });

      const result = await BimbelPackageService.getBimbelPackageBySlug('math-package');

      expect(mockPrisma.prisma.bimbelPackage.findUnique).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({
        id: 1,
        name: 'Math Package',
        slug: 'math-package',
      });
    });

    it('should return null if package is not found', async () => {
      mockPrisma.prisma.bimbelPackage.findUnique.mockResolvedValueOnce(null);

      const result = await BimbelPackageService.getBimbelPackageBySlug('nonexistent-package');

      expect(result).toBeNull();
    });
  });

  describe('createBimbelPackage', () => {
    it('should create a new bimbel package', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1' });
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }]);
      mockPrisma.prisma.bimbelPackage.create.mockResolvedValueOnce({
        id: 1,
        name: 'Math Package',
      });

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
        discount: 10,
      });

      expect(mockPrisma.prisma.bimbelPackage.create).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({
        message: 'Bimbel package created successfully',
        data: { id: 1, name: 'Math Package' },
      });
    });

    it('should throw an error if tutor is not found', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        BimbelPackageService.createBimbelPackage({
          tutorId: 'nonexistent-tutor',
        })
      ).rejects.toThrow('Tutor (user) tidak ditemukan');
    });
  });

  describe('updateBimbelPackage', () => {
    it('should update a bimbel package', async () => {
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }]);
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({
        id: 1,
        name: 'Updated Package',
      });

      const result = await BimbelPackageService.updateBimbelPackage('1', {
        name: 'Updated Package',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 60,
        area: 'Jakarta',
        tutorId: 'tutor1',
        groupType: [{ type: 'privat', price: 100000 }],
        days: ['Senin'],
        discount: 10,
      });

      expect(mockPrisma.prisma.bimbelPackage.update).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({
        message: 'Bimbel package updated successfully',
        data: { id: 1, name: 'Updated Package' },
      });
    });
  });

  describe('deleteBimbelPackage', () => {
    it('should delete a bimbel package', async () => {
      mockPrisma.prisma.groupType.deleteMany.mockResolvedValueOnce({});
      mockPrisma.prisma.packageDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.prisma.bimbelPackage.delete.mockResolvedValueOnce({});

      const result = await BimbelPackageService.deleteBimbelPackage('1');

      expect(mockPrisma.prisma.groupType.deleteMany).toHaveBeenCalledWith(expect.any(Object));
      expect(mockPrisma.prisma.packageDay.deleteMany).toHaveBeenCalledWith(expect.any(Object));
      expect(mockPrisma.prisma.bimbelPackage.delete).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ message: 'Bimbel package deleted successfully' });
    });
  });

  describe('getBimbelPackageStatistics', () => {
    it('should return bimbel package statistics', async () => {
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(10);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(8);

      const result = await BimbelPackageService.getBimbelPackageStatistics();

      expect(mockPrisma.prisma.bimbelPackage.count).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        totalPackages: 10,
        activePackages: 8,
        inactivePackages: 2,
      });
    });
  });

  describe('getMyPackages', () => {
    it('should return bimbel packages for the logged-in tutor', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        { id: 1, name: 'Math Package', isActive: true },
      ]);

      const result = await BimbelPackageService.getMyPackages({ id: 'tutor1', role: 'tutor' });

      expect(mockPrisma.prisma.bimbelPackage.findMany).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual([
        { id: 1, name: 'Math Package', isActive: true },
      ]);
    });

    it('should throw an error if user is not a tutor', async () => {
      await expect(
        BimbelPackageService.getMyPackages({ id: 'user1', role: 'siswa' })
      ).rejects.toThrow('Only tutors can access this resource');
    });
  });
});