import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const packageMock = { id: 1, name: 'Paket A', slug: 'paket-a' };
const packagesMock = [packageMock];
const statisticsMock = { total: 10 };
const recommendationsMock = [{ id: 2, name: 'Rekomendasi' }];

jest.unstable_mockModule('../../services/package.js', () => ({
  BimbelPackageService: {
    getAllBimbelPackages: jest.fn(),
    getActiveBimbelPackages: jest.fn(),
    getBimbelPackageBySlug: jest.fn(),
    createBimbelPackage: jest.fn(),
    createClassBimbelPackage: jest.fn(),
    updateBimbelPackage: jest.fn(),
    updateClassBimbelPackage: jest.fn(),
    deleteBimbelPackage: jest.fn(),
    updateBimbelPackageStatus: jest.fn(),
    getBimbelPackagesByPopularity: jest.fn(),
    getRunningPrograms: jest.fn(),
    getMyPackages: jest.fn(),
    getMyPackageBySlug: jest.fn(),
    getBimbelPackageStatistics: jest.fn(),
    getMyProgramsStatistics: jest.fn(),
    getRecommendations: jest.fn(),
    getFilteredBimbelPackages: jest.fn(),
    getBimbelPackagesByUserId: jest.fn(),
    getMyProgramsStatistics: jest.fn(),
  },
}));

const { BimbelPackageController } = await import('../../controllers/package.js');
const { BimbelPackageService } = await import('../../services/package.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('BimbelPackageController', () => {
  it('getAllBimbelPackages with query', async () => {
    BimbelPackageService.getAllBimbelPackages.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock({ req: { query: { page: '2', limit: '5' } } });
    await BimbelPackageController.getAllBimbelPackages(req, res);
    expect(BimbelPackageService.getAllBimbelPackages).toHaveBeenCalledWith({ page: 2, pageSize: 5, search: '' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getAllBimbelPackages with default pagination', async () => {
    BimbelPackageService.getAllBimbelPackages.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock({ req: { query: {} } });
    await BimbelPackageController.getAllBimbelPackages(req, res);
    expect(BimbelPackageService.getAllBimbelPackages).toHaveBeenCalledWith({ page: 1, pageSize: 8, search: '' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getActiveBimbelPackages with query', async () => {
    BimbelPackageService.getActiveBimbelPackages.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock({ req: { query: { page: '3', limit: '2' } } });
    await BimbelPackageController.getActiveBimbelPackages(req, res);
    expect(BimbelPackageService.getActiveBimbelPackages).toHaveBeenCalledWith({ page: 3, pageSize: 2 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getActiveBimbelPackages with default page and limit (query kosong)', async () => {
    BimbelPackageService.getActiveBimbelPackages.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock({ req: { query: {} } });
    await BimbelPackageController.getActiveBimbelPackages(req, res);
    expect(BimbelPackageService.getActiveBimbelPackages).toHaveBeenCalledWith({ page: 1, pageSize: 8 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getActiveBimbelPackages with only page', async () => {
    BimbelPackageService.getActiveBimbelPackages.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock({ req: { query: { page: '3' } } });
    await BimbelPackageController.getActiveBimbelPackages(req, res);
    expect(BimbelPackageService.getActiveBimbelPackages).toHaveBeenCalledWith({ page: 3, pageSize: 8 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getActiveBimbelPackages with only limit', async () => {
    BimbelPackageService.getActiveBimbelPackages.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock({ req: { query: { limit: '5' } } });
    await BimbelPackageController.getActiveBimbelPackages(req, res);
    expect(BimbelPackageService.getActiveBimbelPackages).toHaveBeenCalledWith({ page: 1, pageSize: 5 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getActiveBimbelPackages with both page and limit', async () => {
    BimbelPackageService.getActiveBimbelPackages.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock({ req: { query: { page: '4', limit: '2' } } });
    await BimbelPackageController.getActiveBimbelPackages(req, res);
    expect(BimbelPackageService.getActiveBimbelPackages).toHaveBeenCalledWith({ page: 4, pageSize: 2 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getBimbelPackageBySlug', async () => {
    BimbelPackageService.getBimbelPackageBySlug.mockResolvedValue(packageMock);
    const { req, res } = setupExpressMock({ req: { params: { slug: 'paket-a' } } });
    await BimbelPackageController.getBimbelPackageBySlug(req, res);
    expect(BimbelPackageService.getBimbelPackageBySlug).toHaveBeenCalledWith('paket-a');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('createBimbelPackage', async () => {
    BimbelPackageService.createBimbelPackage.mockResolvedValue(packageMock);
    const { req, res } = setupExpressMock({ req: { body: { name: 'Paket A' } } });
    await BimbelPackageController.createBimbelPackage(req, res);
    expect(BimbelPackageService.createBimbelPackage).toHaveBeenCalledWith({ name: 'Paket A' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('createClassBimbelPackage', async () => {
    BimbelPackageService.createClassBimbelPackage.mockResolvedValue(packageMock);
    const { req, res } = setupExpressMock({ req: { body: { name: 'Paket Kelas' } } });
    await BimbelPackageController.createClassBimbelPackage(req, res);
    expect(BimbelPackageService.createClassBimbelPackage).toHaveBeenCalledWith({ name: 'Paket Kelas' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('updateBimbelPackage', async () => {
    BimbelPackageService.updateBimbelPackage.mockResolvedValue(packageMock);
    const { req, res } = setupExpressMock({ req: { params: { slug: 'paket-a' }, body: { name: 'Paket Baru' } } });
    await BimbelPackageController.updateBimbelPackage(req, res);
    expect(BimbelPackageService.updateBimbelPackage).toHaveBeenCalledWith('paket-a', { name: 'Paket Baru' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('updateClassBimbelPackage', async () => {
    BimbelPackageService.updateClassBimbelPackage.mockResolvedValue(packageMock);
    const { req, res } = setupExpressMock({ req: { params: { slug: 'paket-a' }, body: { name: 'Paket Baru' } } });
    await BimbelPackageController.updateClassBimbelPackage(req, res);
    expect(BimbelPackageService.updateClassBimbelPackage).toHaveBeenCalledWith('paket-a', { name: 'Paket Baru' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('deleteBimbelPackage', async () => {
    BimbelPackageService.deleteBimbelPackage.mockResolvedValue();
    const { req, res } = setupExpressMock({ req: { params: { slug: 'paket-a' } } });
    await BimbelPackageController.deleteBimbelPackage(req, res);
    expect(BimbelPackageService.deleteBimbelPackage).toHaveBeenCalledWith('paket-a');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Bimbel package deleted successfully' });
  });

  it('updateBimbelPackageStatus', async () => {
    BimbelPackageService.updateBimbelPackageStatus.mockResolvedValue(packageMock);
    const { req, res } = setupExpressMock({ req: { body: { packageId: 1 } } });
    await BimbelPackageController.updateBimbelPackageStatus(req, res);
    expect(BimbelPackageService.updateBimbelPackageStatus).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('getBimbelPackagesByPopularity', async () => {
    BimbelPackageService.getBimbelPackagesByPopularity.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock();
    await BimbelPackageController.getBimbelPackagesByPopularity(req, res);
    expect(BimbelPackageService.getBimbelPackagesByPopularity).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getRunningPrograms', async () => {
    BimbelPackageService.getRunningPrograms.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock();
    await BimbelPackageController.getRunningPrograms(req, res);
    expect(BimbelPackageService.getRunningPrograms).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getMyPackages', async () => {
    BimbelPackageService.getMyPackages.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock();
    res.locals.user = { id: 1, role: 'tutor' };
    await BimbelPackageController.getMyPackages(req, res);
    expect(BimbelPackageService.getMyPackages).toHaveBeenCalledWith({ id: 1, role: 'tutor' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getMyPackageBySlug returns package if found', async () => {
    BimbelPackageService.getMyPackageBySlug.mockResolvedValue(packageMock);
    const { req, res } = setupExpressMock({ req: { params: { slug: 'paket-a' } } });
    res.locals.user = { id: 1 };
    await BimbelPackageController.getMyPackageBySlug(req, res);
    expect(BimbelPackageService.getMyPackageBySlug).toHaveBeenCalledWith('paket-a', { id: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('getMyPackageBySlug returns 404 if not found', async () => {
    BimbelPackageService.getMyPackageBySlug.mockResolvedValue(null);
    const { req, res } = setupExpressMock({ req: { params: { slug: 'paket-x' } } });
    res.locals.user = { id: 1 };
    await BimbelPackageController.getMyPackageBySlug(req, res);
    expect(BimbelPackageService.getMyPackageBySlug).toHaveBeenCalledWith('paket-x', { id: 1 });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Bimbel package not found or not associated with the user' });
  });

  it('getBimbelPackageStatistics', async () => {
    BimbelPackageService.getBimbelPackageStatistics.mockResolvedValue(statisticsMock);
    const { req, res } = setupExpressMock();
    await BimbelPackageController.getBimbelPackageStatistics(req, res);
    expect(BimbelPackageService.getBimbelPackageStatistics).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(statisticsMock);
  });

  it('getMyProgramsStatistics', async () => {
    BimbelPackageService.getMyProgramsStatistics.mockResolvedValue(statisticsMock);
    const { req, res } = setupExpressMock();
    res.locals.user = { id: 1 };
    await BimbelPackageController.getMyProgramsStatistics(req, res);
    expect(BimbelPackageService.getMyProgramsStatistics).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(statisticsMock);
  });

  it('getRecommendations returns recommendations', async () => {
    BimbelPackageService.getRecommendations.mockResolvedValue(recommendationsMock);
    const { req, res } = setupExpressMock();
    res.locals.user = { id: 1, role: 'student' };
    await BimbelPackageController.getRecommendations(req, res);
    expect(BimbelPackageService.getRecommendations).toHaveBeenCalledWith({ id: 1, role: 'student' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(recommendationsMock);
  });

  it('getRecommendations returns message if no recommendations', async () => {
    BimbelPackageService.getRecommendations.mockResolvedValue(null);
    const { req, res } = setupExpressMock();
    res.locals.user = { id: 1, role: 'student' };
    await BimbelPackageController.getRecommendations(req, res);
    expect(BimbelPackageService.getRecommendations).toHaveBeenCalledWith({ id: 1, role: 'student' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'No recommendations available for this user.' });
  });

  it('getFilteredBimbelPackages with all filters', async () => {
    BimbelPackageService.getFilteredBimbelPackages.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock({
      req: { query: { searchText: 'abc', level: 'A', hari: 'senin,selasa', durasi: '90' } },
    });
    await BimbelPackageController.getFilteredBimbelPackages(req, res);
    expect(BimbelPackageService.getFilteredBimbelPackages).toHaveBeenCalledWith({
      searchText: 'abc',
      level: 'A',
      hari: ['senin', 'selasa'],
      durasi: 90,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: packagesMock });
  });

  it('getFilteredBimbelPackages with minimal filters', async () => {
    BimbelPackageService.getFilteredBimbelPackages.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock({ req: { query: {} } });
    await BimbelPackageController.getFilteredBimbelPackages(req, res);
    expect(BimbelPackageService.getFilteredBimbelPackages).toHaveBeenCalledWith({
      searchText: undefined,
      level: undefined,
      hari: undefined,
      durasi: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: packagesMock });
  });

  it('getBimbelPackagesByUserId', async () => {
    BimbelPackageService.getBimbelPackagesByUserId.mockResolvedValue(packagesMock);
    const { req, res } = setupExpressMock({ req: { params: { userId: '42' } } });
    await BimbelPackageController.getBimbelPackagesByUserId(req, res);
    expect(BimbelPackageService.getBimbelPackagesByUserId).toHaveBeenCalledWith('42');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: packagesMock });
  });

  it('getProgramsStatisticsByUserId', async () => {
    BimbelPackageService.getMyProgramsStatistics.mockResolvedValue(statisticsMock);
    const { req, res } = setupExpressMock({ req: { params: { userId: '42' } } });
    await BimbelPackageController.getProgramsStatisticsByUserId(req, res);
    expect(BimbelPackageService.getMyProgramsStatistics).toHaveBeenCalledWith('42');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(statisticsMock);
  });
});