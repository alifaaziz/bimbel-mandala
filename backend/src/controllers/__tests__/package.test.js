import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const packageMock = { id: 1, name: 'Paket 1', isActive: true };
const packagesMock = [packageMock];
const statisticsMock = { total: 10, active: 5 };

jest.unstable_mockModule('../../services/package.js', () => ({
  BimbelPackageService: {
    getAllBimbelPackages: jest.fn(() => Promise.resolve(packagesMock)),
    getActiveBimbelPackages: jest.fn(() => Promise.resolve(packagesMock)),
    getBimbelPackageById: jest.fn(() => Promise.resolve(packageMock)),
    createBimbelPackage: jest.fn(() => Promise.resolve(packageMock)),
    createClassBimbelPackage: jest.fn(() => Promise.resolve(packageMock)),
    updateBimbelPackage: jest.fn(() => Promise.resolve(packageMock)),
    updateClassBimbelPackage: jest.fn(() => Promise.resolve(packageMock)),
    deleteBimbelPackage: jest.fn(() => Promise.resolve()),
    updateBimbelPackageStatus: jest.fn(() => Promise.resolve(packageMock)),
    getBimbelPackagesByPopularity: jest.fn(() => Promise.resolve(packagesMock)),
    getRunningPrograms: jest.fn(() => Promise.resolve(packagesMock)),
    getMyPackages: jest.fn(() => Promise.resolve(packagesMock)),
    getMyPackageById: jest.fn(() => Promise.resolve(packageMock)),
    getBimbelPackageStatistics: jest.fn(() => Promise.resolve(statisticsMock)),
    getMyProgramsStatistics: jest.fn(() => Promise.resolve(statisticsMock)),
  },
}));

const { BimbelPackageController } = await import('../../controllers/package.js');
const { BimbelPackageService } = await import('../../services/package.js');

describe('BimbelPackageController', () => {
  it('getAllBimbelPackages', async () => {
    const { req, res } = setupExpressMock();
    await BimbelPackageController.getAllBimbelPackages(req, res);
    expect(BimbelPackageService.getAllBimbelPackages).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getActiveBimbelPackages', async () => {
    const { req, res } = setupExpressMock();
    await BimbelPackageController.getActiveBimbelPackages(req, res);
    expect(BimbelPackageService.getActiveBimbelPackages).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getBimbelPackageById', async () => {
    const { req, res } = setupExpressMock({ req: { params: { id: 1 } } });
    await BimbelPackageController.getBimbelPackageById(req, res);
    expect(BimbelPackageService.getBimbelPackageById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('createBimbelPackage', async () => {
    const { req, res } = setupExpressMock({ req: { body: { name: 'Paket 1' } } });
    await BimbelPackageController.createBimbelPackage(req, res);
    expect(BimbelPackageService.createBimbelPackage).toHaveBeenCalledWith({ name: 'Paket 1' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('createClassBimbelPackage', async () => {
    const { req, res } = setupExpressMock({ req: { body: { name: 'Paket Kelas' } } });
    await BimbelPackageController.createClassBimbelPackage(req, res);
    expect(BimbelPackageService.createClassBimbelPackage).toHaveBeenCalledWith({ name: 'Paket Kelas' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('updateBimbelPackage', async () => {
    const { req, res } = setupExpressMock({ req: { params: { id: 1 }, body: { name: 'Update' } } });
    await BimbelPackageController.updateBimbelPackage(req, res);
    expect(BimbelPackageService.updateBimbelPackage).toHaveBeenCalledWith(1, { name: 'Update' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('updateClassBimbelPackage', async () => {
    const { req, res } = setupExpressMock({ req: { params: { id: 1 }, body: { name: 'Update', groupType: { price: 100 } } } });
    await BimbelPackageController.updateClassBimbelPackage(req, res);
    expect(BimbelPackageService.updateClassBimbelPackage).toHaveBeenCalledWith(1, { name: 'Update', groupType: { price: 100 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('updateClassBimbelPackage returns 400 if groupType.price missing', async () => {
    const { req, res } = setupExpressMock({ req: { params: { id: 1 }, body: { name: 'Update', groupType: {} } } });
    await BimbelPackageController.updateClassBimbelPackage(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Group type price is required' });
  });

  it('deleteBimbelPackage', async () => {
    const { req, res } = setupExpressMock({ req: { params: { id: 1 } } });
    await BimbelPackageController.deleteBimbelPackage(req, res);
    expect(BimbelPackageService.deleteBimbelPackage).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Bimbel package deleted successfully' });
  });

  it('updateBimbelPackageStatus', async () => {
    const { req, res } = setupExpressMock({ req: { body: { packageId: 1 } } });
    await BimbelPackageController.updateBimbelPackageStatus(req, res);
    expect(BimbelPackageService.updateBimbelPackageStatus).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('getBimbelPackagesByPopularity', async () => {
    const { req, res } = setupExpressMock();
    await BimbelPackageController.getBimbelPackagesByPopularity(req, res);
    expect(BimbelPackageService.getBimbelPackagesByPopularity).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getRunningPrograms', async () => {
    const { req, res } = setupExpressMock();
    await BimbelPackageController.getRunningPrograms(req, res);
    expect(BimbelPackageService.getRunningPrograms).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getMyPackages', async () => {
    const { req, res } = setupExpressMock({ res: { locals: { user: { id: 123 } } } });
    await BimbelPackageController.getMyPackages(req, res);
    expect(BimbelPackageService.getMyPackages).toHaveBeenCalledWith({ id: 123 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packagesMock);
  });

  it('getMyPackageById', async () => {
    const { req, res } = setupExpressMock({ req: { params: { id: 1 } }, res: { locals: { user: { id: 123 } } } });
    await BimbelPackageController.getMyPackageById(req, res);
    expect(BimbelPackageService.getMyPackageById).toHaveBeenCalledWith(1, { id: 123 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(packageMock);
  });

  it('getMyPackageById returns 404 if not found', async () => {
    BimbelPackageService.getMyPackageById.mockResolvedValueOnce(null);
    const { req, res } = setupExpressMock({ req: { params: { id: 1 } }, res: { locals: { user: { id: 123 } } } });
    await BimbelPackageController.getMyPackageById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Bimbel package not found or not associated with the user' });
  });

  it('getBimbelPackageStatistics', async () => {
    const { req, res } = setupExpressMock();
    await BimbelPackageController.getBimbelPackageStatistics(req, res);
    expect(BimbelPackageService.getBimbelPackageStatistics).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(statisticsMock);
  });

  it('getMyProgramsStatistics', async () => {
    const { req, res } = setupExpressMock({ res: { locals: { user: { id: 123 } } } });
    await BimbelPackageController.getMyProgramsStatistics(req, res);
    expect(BimbelPackageService.getMyProgramsStatistics).toHaveBeenCalledWith({ id: 123 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(statisticsMock);
  });
});