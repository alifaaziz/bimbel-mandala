import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const packageMock = { id: 1, name: 'Math Package', level: 'SMA' };
const packagesMock = [
  { id: 1, name: 'Math Package', level: 'SMA' },
  { id: 2, name: 'Science Package', level: 'SMP' },
];
const statisticsMock = { totalPackages: 10, activePackages: 8 };

jest.unstable_mockModule('../../services/package.js', () => ({
  BimbelPackageService: {
    getAllBimbelPackages: jest.fn(() => Promise.resolve(packagesMock)),
    getActiveBimbelPackages: jest.fn(() => Promise.resolve(packagesMock)),
    getBimbelPackageBySlug: jest.fn(() => Promise.resolve(packageMock)),
    createBimbelPackage: jest.fn(() => Promise.resolve(packageMock)),
    createClassBimbelPackage: jest.fn(() => Promise.resolve(packageMock)),
    updateBimbelPackage: jest.fn(() => Promise.resolve(packageMock)),
    updateClassBimbelPackage: jest.fn(() => Promise.resolve(packageMock)),
    deleteBimbelPackage: jest.fn(() => Promise.resolve()),
    updateBimbelPackageStatus: jest.fn(() => Promise.resolve(packageMock)),
    getBimbelPackagesByPopularity: jest.fn(() => Promise.resolve(packagesMock)),
    getRunningPrograms: jest.fn(() => Promise.resolve(packagesMock)),
    getMyPackages: jest.fn(() => Promise.resolve(packagesMock)),
    getMyPackageBySlug: jest.fn(() => Promise.resolve(packageMock)),
    getBimbelPackageStatistics: jest.fn(() => Promise.resolve(statisticsMock)),
    getMyProgramsStatistics: jest.fn(() => Promise.resolve(statisticsMock)),
  },
}));

const { BimbelPackageController } = await import('../../controllers/package.js');
const { BimbelPackageService } = await import('../../services/package.js');

describe('BimbelPackageController', () => {
  describe('getAllBimbelPackages', () => {
    it('should return all bimbel packages', async () => {
      const { req, res } = setupExpressMock();

      await BimbelPackageController.getAllBimbelPackages(req, res);

      expect(BimbelPackageService.getAllBimbelPackages).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(packagesMock);
    });
  });

  describe('getActiveBimbelPackages', () => {
    it('should return active bimbel packages', async () => {
      const { req, res } = setupExpressMock();

      await BimbelPackageController.getActiveBimbelPackages(req, res);

      expect(BimbelPackageService.getActiveBimbelPackages).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(packagesMock);
    });
  });

  describe('getBimbelPackageBySlug', () => {
    it('should return a bimbel package by slug', async () => {
      const { req, res } = setupExpressMock({
        req: { params: { slug: 'math-package' } },
      });

      await BimbelPackageController.getBimbelPackageBySlug(req, res);

      expect(BimbelPackageService.getBimbelPackageBySlug).toHaveBeenCalledWith('math-package');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(packageMock);
    });
  });

  describe('createBimbelPackage', () => {
    it('should create a new bimbel package', async () => {
      const { req, res } = setupExpressMock({
        req: {
          body: {
            name: 'Math Package',
            level: 'SMA',
            totalMeetings: 10,
            time: '10:00',
            duration: 60,
            area: 'Jakarta',
            tutorId: 1,
            groupType: { price: 100000 },
            days: ['Monday', 'Wednesday'],
            discount: 10,
          },
        },
      });

      await BimbelPackageController.createBimbelPackage(req, res);

      expect(BimbelPackageService.createBimbelPackage).toHaveBeenCalledWith({
        name: 'Math Package',
        level: 'SMA',
        totalMeetings: 10,
        time: '10:00',
        duration: 60,
        area: 'Jakarta',
        tutorId: 1,
        groupType: { price: 100000 },
        days: ['Monday', 'Wednesday'],
        discount: 10,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(packageMock);
    });
  });

  describe('updateBimbelPackage', () => {
    it('should update a bimbel package', async () => {
      const { req, res } = setupExpressMock({
        req: {
          params: { id: 1 },
          body: {
            name: 'Updated Package',
            level: 'SMP',
            totalMeetings: 12,
            time: '14:00',
            duration: 90,
            area: 'Bandung',
            tutorId: 2,
            groupType: { price: 150000 },
            days: ['Tuesday', 'Thursday'],
            discount: 15,
          },
        },
      });

      await BimbelPackageController.updateBimbelPackage(req, res);

      expect(BimbelPackageService.updateBimbelPackage).toHaveBeenCalledWith(1, {
        name: 'Updated Package',
        level: 'SMP',
        totalMeetings: 12,
        time: '14:00',
        duration: 90,
        area: 'Bandung',
        tutorId: 2,
        groupType: { price: 150000 },
        days: ['Tuesday', 'Thursday'],
        discount: 15,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(packageMock);
    });
  });

  describe('deleteBimbelPackage', () => {
    it('should delete a bimbel package', async () => {
      const { req, res } = setupExpressMock({
        req: { params: { id: 1 } },
      });

      await BimbelPackageController.deleteBimbelPackage(req, res);

      expect(BimbelPackageService.deleteBimbelPackage).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Bimbel package deleted successfully' });
    });
  });

  describe('getBimbelPackageStatistics', () => {
    it('should return bimbel package statistics', async () => {
      const { req, res } = setupExpressMock();

      await BimbelPackageController.getBimbelPackageStatistics(req, res);

      expect(BimbelPackageService.getBimbelPackageStatistics).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(statisticsMock);
    });
  });

  describe('createClassBimbelPackage', () => {
    it('should create a new class bimbel package', async () => {
      const { req, res } = setupExpressMock({
        req: { body: { name: 'Math Class Package', level: 'SMA' } },
      });

      await BimbelPackageController.createClassBimbelPackage(req, res);

      expect(BimbelPackageService.createClassBimbelPackage).toHaveBeenCalledWith({
        name: 'Math Class Package',
        level: 'SMA',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(packageMock);
    });
  });

  describe('updateClassBimbelPackage', () => {
    it('should update a class bimbel package', async () => {
      const { req, res } = setupExpressMock({
        req: {
          params: { id: 1 },
          body: { name: 'Updated Class Package', level: 'SMP', groupType: { price: 150000 } },
        },
      });

      await BimbelPackageController.updateClassBimbelPackage(req, res);

      expect(BimbelPackageService.updateClassBimbelPackage).toHaveBeenCalledWith(1, {
        name: 'Updated Class Package',
        level: 'SMP',
        groupType: { price: 150000 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(packageMock);
    });
  });

  describe('updateBimbelPackageStatus', () => {
    it('should update bimbel package status', async () => {
      const { req, res } = setupExpressMock({
        req: { body: { packageId: 1 } },
      });

      await BimbelPackageController.updateBimbelPackageStatus(req, res);

      expect(BimbelPackageService.updateBimbelPackageStatus).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(packageMock);
    });
  });

  describe('getBimbelPackagesByPopularity', () => {
    it('should return bimbel packages sorted by popularity', async () => {
      const { req, res } = setupExpressMock();

      await BimbelPackageController.getBimbelPackagesByPopularity(req, res);

      expect(BimbelPackageService.getBimbelPackagesByPopularity).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(packagesMock);
    });
  });

  describe('getRunningPrograms', () => {
    it('should return running programs with incomplete schedules', async () => {
      const { req, res } = setupExpressMock();

      await BimbelPackageController.getRunningPrograms(req, res);

      expect(BimbelPackageService.getRunningPrograms).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(packagesMock);
    });
  });

  describe('getMyPackages', () => {
    it('should return bimbel packages for the logged-in tutor', async () => {
      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 123, role: 'tutor' } } },
      });

      await BimbelPackageController.getMyPackages(req, res);

      expect(BimbelPackageService.getMyPackages).toHaveBeenCalledWith({ id: 123, role: 'tutor' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(packagesMock);
    });
  });

  describe('getMyPackageBySlug', () => {
    it('should return a bimbel package for the logged-in user by slug', async () => {
      const { req, res } = setupExpressMock({
        req: { params: { slug: 'math-package' } },
        res: { locals: { user: { id: 123, role: 'student' } } },
      });

      await BimbelPackageController.getMyPackageBySlug(req, res);

      expect(BimbelPackageService.getMyPackageBySlug).toHaveBeenCalledWith('math-package', {
        id: 123,
        role: 'student',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(packageMock);
    });

    it('should return 404 if the package is not found or not associated with the user', async () => {
      BimbelPackageService.getMyPackageBySlug.mockResolvedValue(null);

      const { req, res } = setupExpressMock({
        req: { params: { slug: 'nonexistent-package' } },
        res: { locals: { user: { id: 123, role: 'student' } } },
      });

      await BimbelPackageController.getMyPackageBySlug(req, res);

      expect(BimbelPackageService.getMyPackageBySlug).toHaveBeenCalledWith('nonexistent-package', {
        id: 123,
        role: 'student',
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Bimbel package not found or not associated with the user',
      });
    });
  });

  describe('getMyProgramsStatistics', () => {
    it('should return statistics for the logged-in user', async () => {
      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 123, role: 'tutor' } } },
      });

      await BimbelPackageController.getMyProgramsStatistics(req, res);

      expect(BimbelPackageService.getMyProgramsStatistics).toHaveBeenCalledWith({
        id: 123,
        role: 'tutor',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(statisticsMock);
    });
  });
});