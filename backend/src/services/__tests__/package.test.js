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
        {
          id: 1,
          name: 'Math Package',
          isActive: true,
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }],
        },
      ]);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(1);

      const result = await BimbelPackageService.getActiveBimbelPackages({ page: 1, pageSize: 10 });

      expect(mockPrisma.prisma.bimbelPackage.findMany).toHaveBeenCalledWith(expect.any(Object));
      expect(mockPrisma.prisma.bimbelPackage.count).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({
        data: [
          {
            name: 'Math Package',
            level: undefined,
            totalMeetings: undefined,
            time: undefined,
            duration: undefined,
            area: undefined,
            slug: undefined,
            isActive: true,
            tutorName: 'Tutor A',
            photo: 'photo.jpg',
            groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
            days: ['Senin'],
          },
        ],
        total: 1,
        page: 1,
        pageSize: 10,
      });
    });
  });

  describe('getAllBimbelPackages', () => {
    it('should return all bimbel packages with pagination', async () => {
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Math Package',
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }],
        },
      ]);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(1);

      const result = await BimbelPackageService.getAllBimbelPackages({ page: 1, pageSize: 10 });

      expect(mockPrisma.prisma.bimbelPackage.findMany).toHaveBeenCalledWith(expect.any(Object));
      expect(mockPrisma.prisma.bimbelPackage.count).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({
        data: [
          {
            name: 'Math Package',
            level: undefined,
            totalMeetings: undefined,
            time: undefined,
            duration: undefined,
            area: undefined,
            slug: undefined,
            isActive: undefined,
            tutorName: 'Tutor A',
            photo: 'photo.jpg',
            groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
            days: ['Senin'],
          },
        ],
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
        user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
        groupType: [{ id: 1, type: 'privat', price: 100000, discPrice: 90000 }],
        packageDay: [{ day: { daysName: 'Senin' } }],
      });

      const result = await BimbelPackageService.getBimbelPackageBySlug('math-package');

      expect(mockPrisma.prisma.bimbelPackage.findUnique).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({
        id: 1,
        name: 'Math Package',
        level: undefined,
        totalMeetings: undefined,
        time: undefined,
        duration: undefined,
        area: undefined,
        slug: 'math-package',
        tutorName: 'Tutor A',
        photo: 'photo.jpg',
        groupType: [{ id: 1, type: 'privat', price: 100000, discPrice: 90000 }],
        days: ['Senin'],
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

    it('should throw an error if days array is empty in createBimbelPackage', async () => {
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
        discount: 10,
      })
      ).rejects.toThrow('Invalid days provided');
    });
  });

  describe('createClassBimbelPackage', () => {
    it('should create a new class bimbel package successfully', async () => {
      mockPrisma.prisma.user.findUnique.mockResolvedValueOnce({ id: 'tutor1' });
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      const createdPackage = {
        id: 1,
        name: 'Class Math Package',
        groupType: [
          { type: 'kelas', price: 200000, maxStudent: 30 }
        ],
        packageDay: [
          { day: { id: 1, daysName: 'Senin' } },
          { day: { id: 2, daysName: 'Selasa' } }
        ]
      };
      mockPrisma.prisma.bimbelPackage.create.mockResolvedValueOnce(createdPackage);

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

      expect(mockPrisma.prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'tutor1' } });
      expect(mockPrisma.prisma.day.findMany).toHaveBeenCalledWith({
        where: { daysName: { in: ['Senin', 'Selasa'] } },
        select: { id: true }
      });
      expect(mockPrisma.prisma.bimbelPackage.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          name: 'Class Math Package',
          groupType: {
            create: {
              type: 'kelas',
              price: 200000,
              maxStudent: 30
            }
          },
          packageDay: {
            create: [
              { day: { connect: { id: 1 } } },
              { day: { connect: { id: 2 } } }
            ]
          }
        }),
        include: expect.any(Object)
      }));
      expect(result).toEqual({
        message: 'Class bimbel package created successfully',
        data: createdPackage
      });
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

    it('should throw an error if days array is empty in updateBimbelPackage', async () => {
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([]);

      await expect(
      BimbelPackageService.updateBimbelPackage('1', {
        name: 'Updated Package',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 60,
        area: 'Jakarta',
        tutorId: 'tutor1',
        groupType: [{ type: 'privat', price: 100000 }],
        days: ['NonexistentDay'],
        discount: 10,
      })
      ).rejects.toThrow('Invalid days provided');
    });
  });

  describe('updateClassBimbelPackage', () => {
    it('should update a class bimbel package successfully', async () => {
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      const updatedPackage = {
        id: 1,
        name: 'Updated Class Package',
        groupType: [
          { type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }
        ],
        packageDay: [
          { day: { id: 1, daysName: 'Senin' } },
          { day: { id: 2, daysName: 'Selasa' } }
        ]
      };
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce(updatedPackage);

      const result = await BimbelPackageService.updateClassBimbelPackage('1', {
        name: 'Updated Class Package',
        level: 'SMA',
        totalMeetings: 12,
        time: '14:00',
        duration: 90,
        area: 'Bandung',
        tutorId: 'tutor2',
        groupType: { price: 200000, maxStudent: 20 },
        days: ['Senin', 'Selasa'],
        discount: 10
      });

      expect(mockPrisma.prisma.day.findMany).toHaveBeenCalledWith({
        where: { daysName: { in: ['Senin', 'Selasa'] } },
        select: { id: true }
      });
      expect(mockPrisma.prisma.bimbelPackage.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
        data: expect.objectContaining({
          name: 'Updated Class Package',
          groupType: expect.objectContaining({
            deleteMany: {},
            create: [
              { type: 'kelas', price: 200000, discPrice: 180000, maxStudent: 20 }
            ]
          }),
          packageDay: expect.objectContaining({
            deleteMany: {},
            create: [
              { day: { connect: { id: 1 } } },
              { day: { connect: { id: 2 } } }
            ]
          })
        }),
        include: expect.any(Object)
      }));
      expect(result).toEqual({
        message: 'Class bimbel package updated successfully',
        data: updatedPackage
      });
    });

    it('should throw an error if no valid days are provided', async () => {
      mockPrisma.prisma.day.findMany.mockResolvedValueOnce([]);
      await expect(
        BimbelPackageService.updateClassBimbelPackage('1', {
          name: 'Invalid Days Package',
          groupType: { price: 100000, maxStudent: 10 },
          days: ['NonexistentDay'],
          discount: 0
        })
      ).rejects.toThrow('Invalid days provided');
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
        {
          id: 1,
          name: 'Math Package',
          isActive: true,
          user: { tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }],
        },
      ]);

      const result = await BimbelPackageService.getMyPackages({ id: 'tutor1', role: 'tutor' });

      expect(mockPrisma.prisma.bimbelPackage.findMany).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual([
        {
          id: 1,
          name: 'Math Package',
          level: undefined,
          totalMeetings: undefined,
          time: undefined,
          duration: undefined,
          area: undefined,
          slug: undefined,
          isActive: true,
          photo: 'photo.jpg',
          groupType: [{ type: 'privat', price: 90000, discPrice: 81000 }],
          days: ['Senin'],
        },
      ]);
    });

    it('should throw an error if user is not a tutor', async () => {
      await expect(
        BimbelPackageService.getMyPackages({ id: 'user1', role: 'siswa' })
      ).rejects.toThrow('Only tutors can access this resource');
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

      expect(mockPrisma.prisma.bimbelPackage.findFirst).toHaveBeenCalledWith({
        where: { slug: 'math-package', userId: 'tutor1' },
        include: {
          groupType: { select: { type: true, price: true, discPrice: true } },
          packageDay: { select: { day: { select: { daysName: true } } } }
        }
      });
      expect(result).toEqual({
        id: 1,
        name: 'Math Package',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 60,
        area: 'Jakarta',
        slug: 'math-package',
        groupType: [
          { type: 'privat', price: 90000, discPrice: 81000 }
        ],
        days: ['Senin', 'Selasa']
      });
    });

    it('should return null if the package is not found for the tutor', async () => {
      mockPrisma.prisma.bimbelPackage.findFirst.mockResolvedValueOnce(null);

      const result = await BimbelPackageService.getMyPackageBySlug('nonexistent-package', { id: 'tutor1', role: 'tutor' });

      expect(result).toBeNull();
    });

    it('should throw an error if user is not a tutor', async () => {
      await expect(
        BimbelPackageService.getMyPackageBySlug('math-package', { id: 'user1', role: 'siswa' })
      ).rejects.toThrow('Only tutors can access this resource');
    });
  });

  describe('updateBimbelPackageStatus', () => {
    it('should update isActive to true if all schedules have attendances', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          schedules: [{ attendances: [{}] }],
          order: { bimbelPackage: { id: 1 } },
        },
      ]);
      mockPrisma.prisma.bimbelPackage.update.mockResolvedValueOnce({});

      const result = await BimbelPackageService.updateBimbelPackageStatus();

      expect(mockPrisma.prisma.class.findMany).toHaveBeenCalled();
      expect(mockPrisma.prisma.bimbelPackage.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: true },
      });
      expect(result).toEqual({ message: 'Bimbel package status updated successfully' });
    });
  });

  describe('getBimbelPackagesByPopularity', () => {
    it('should return bimbel packages sorted by popularity', async () => {
      mockPrisma.prisma.order.groupBy.mockResolvedValueOnce([
        { packageId: 1, _count: { packageId: 5 } },
      ]);
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'Math Package',
          isActive: true,
          user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          packageDay: [{ day: { daysName: 'Senin' } }],
        },
      ]);

      const result = await BimbelPackageService.getBimbelPackagesByPopularity();

      expect(mockPrisma.prisma.order.groupBy).toHaveBeenCalled();
      expect(mockPrisma.prisma.bimbelPackage.findMany).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: 1,
          name: 'Math Package',
          level: undefined,
          totalMeetings: undefined,
          time: undefined,
          duration: undefined,
          area: undefined,
          slug: undefined,
          isActive: true,
          tutorName: 'Tutor A',
          photo: 'photo.jpg',
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          days: ['Senin'],
          orderCount: 5,
        },
      ]);
    });
  });

  describe('getRunningPrograms', () => {
    it('should return running programs with classId, tutorName, and bimbelPackageName', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        {
          id: 1,
          status: 'berjalan',
          tutor: { name: 'Tutor A', tutors: [{ gender: 'Male' }] },
          order: { bimbelPackage: { name: 'Math Package' } },
        },
      ]);

      const result = await BimbelPackageService.getRunningPrograms();

      expect(mockPrisma.prisma.class.findMany).toHaveBeenCalledWith({
        where: { status: 'berjalan' },
        include: expect.any(Object),
      });
      expect(result).toEqual([
        {
          classId: 1,
          tutorName: 'Pak Tutor A',
          bimbelPackageName: 'Math Package',
        },
      ]);
    });
  });

  describe('getMyProgramsStatistics', () => {
    it('should return statistics for a student', async () => {
      mockPrisma.prisma.studentClass.findMany.mockResolvedValueOnce([
        { class: { status: 'berjalan' } },
        { class: { status: 'selesai' } },
      ]);

      const result = await BimbelPackageService.getMyProgramsStatistics({ id: 'student1', role: 'siswa' });

      expect(mockPrisma.prisma.studentClass.findMany).toHaveBeenCalledWith({
        where: { userId: 'student1' },
        include: { class: true },
      });
      expect(result).toEqual({
        runningClasses: 1,
        completedClasses: 1,
      });
    });

    it('should return statistics for a tutor', async () => {
      mockPrisma.prisma.class.findMany.mockResolvedValueOnce([
        { status: 'berjalan' },
        { status: 'selesai' },
      ]);
      mockPrisma.prisma.bimbelPackage.count.mockResolvedValueOnce(5);

      const result = await BimbelPackageService.getMyProgramsStatistics({ id: 'tutor1', role: 'tutor' });

      expect(mockPrisma.prisma.class.findMany).toHaveBeenCalledWith({
        where: { tutorId: 'tutor1', status: { in: ['berjalan', 'selesai'] } },
      });
      expect(mockPrisma.prisma.bimbelPackage.count).toHaveBeenCalledWith({
        where: { userId: 'tutor1', isActive: true },
      });
      expect(result).toEqual({
        runningClasses: 1,
        completedClasses: 1,
        activePackages: 5,
      });
    });
    it('should throw an error if role is not supported in getMyProgramsStatistics', async () => {
      await expect(
      BimbelPackageService.getMyProgramsStatistics({ id: 'admin1', role: 'admin' })
      ).rejects.toThrow('Role not supported for this operation');
    });
  });

  describe('getRecommendations', () => {
    it('should return recommended bimbel packages for a student, sorted by orderCount ascending and limited to 4', async () => {
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
          orders: [{}, {}, {}], // 3 orders
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
          orders: [{}], // 1 order
        },
        {
          id: 3,
          name: 'Chemistry Package',
          level: 'SMA',
          totalMeetings: 12,
          time: '14:00',
          duration: 90,
          area: 'Surabaya',
          slug: 'chemistry-package',
          isActive: true,
          user: { name: 'Tutor C', tutors: [{ photo: 'photo3.jpg' }] },
          groupType: [{ type: 'privat', price: 130000, discPrice: 120000 }],
          packageDay: [{ day: { daysName: 'Rabu' } }],
          orders: [{}, {}], // 2 orders
        },
        {
          id: 4,
          name: 'Biology Package',
          level: 'SMA',
          totalMeetings: 6,
          time: '16:00',
          duration: 45,
          area: 'Medan',
          slug: 'biology-package',
          isActive: true,
          user: { name: 'Tutor D', tutors: [{ photo: 'photo4.jpg' }] },
          groupType: [{ type: 'kelompok', price: 90000, discPrice: 85000 }],
          packageDay: [{ day: { daysName: 'Kamis' } }],
          orders: [], // 0 orders
        },
        {
          id: 5,
          name: 'English Package',
          level: 'SMA',
          totalMeetings: 7,
          time: '18:00',
          duration: 60,
          area: 'Bali',
          slug: 'english-package',
          isActive: true,
          user: { name: 'Tutor E', tutors: [{ photo: 'photo5.jpg' }] },
          groupType: [{ type: 'privat', price: 110000, discPrice: 100000 }],
          packageDay: [{ day: { daysName: 'Jumat' } }],
          orders: [{}, {}, {}, {}], // 4 orders
        },
      ]);

      const result = await BimbelPackageService.getRecommendations(user);

      expect(result).toEqual([
        {
          id: 4,
          name: 'Biology Package',
          level: 'SMA',
          totalMeetings: 6,
          time: '16:00',
          duration: 45,
          area: 'Medan',
          slug: 'biology-package',
          isActive: true,
          tutorName: 'Tutor D',
          photo: 'photo4.jpg',
          groupType: [{ type: 'kelompok', price: 90000, discPrice: 85000 }],
          days: ['Kamis'],
          orderCount: 0
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
          tutorName: 'Tutor B',
          photo: 'photo2.jpg',
          groupType: [{ type: 'kelompok', price: 120000, discPrice: 110000 }],
          days: ['Selasa'],
          orderCount: 1
        },
        {
          id: 3,
          name: 'Chemistry Package',
          level: 'SMA',
          totalMeetings: 12,
          time: '14:00',
          duration: 90,
          area: 'Surabaya',
          slug: 'chemistry-package',
          isActive: true,
          tutorName: 'Tutor C',
          photo: 'photo3.jpg',
          groupType: [{ type: 'privat', price: 130000, discPrice: 120000 }],
          days: ['Rabu'],
          orderCount: 2
        },
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
          tutorName: 'Tutor A',
          photo: 'photo1.jpg',
          groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
          days: ['Senin'],
          orderCount: 3
        }
      ]);
    });

    it('should return null if user is not a student', async () => {
      const user = { id: 'tutor1', role: 'tutor' };
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result).toBeNull();
      expect(mockPrisma.prisma.student.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.prisma.bimbelPackage.findMany).not.toHaveBeenCalled();
    });

    it('should return null if student is not found', async () => {
      const user = { id: 'student2', role: 'siswa' };
      mockPrisma.prisma.student.findUnique.mockResolvedValueOnce(null);
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result).toBeNull();
      expect(mockPrisma.prisma.bimbelPackage.findMany).not.toHaveBeenCalled();
    });

    it('should return an empty array if no recommended packages found', async () => {
      const user = { id: 'student3', role: 'siswa' };
      mockPrisma.prisma.student.findUnique.mockResolvedValueOnce({ level: 'SMP' });
      mockPrisma.prisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
      const result = await BimbelPackageService.getRecommendations(user);
      expect(result).toEqual([]);
    });
  });
});