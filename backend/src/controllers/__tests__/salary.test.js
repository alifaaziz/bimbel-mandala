import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const salaryMock = { id: 1, status: 'paid' };
const statsMock = { total: 1000000, paid: 800000, unpaid: 200000 };
const recapMock = [{ id: 1, amount: 500000 }];

jest.unstable_mockModule('../../services/salary.js', () => ({
  SalaryService: {
    updateSalaryStatus: jest.fn(() => Promise.resolve(salaryMock)),
    getFinanceStats: jest.fn(() => Promise.resolve(statsMock)),
    getFinanceRecap: jest.fn(() => Promise.resolve(recapMock)),
  },
}));

const { SalaryController } = await import('../../controllers/salary.js');
const { SalaryService } = await import('../../services/salary.js');

describe('SalaryController', () => {
  describe('updateSalaryStatus', () => {
    it('should update salary status and return 200', async () => {
      SalaryService.updateSalaryStatus.mockResolvedValue(salaryMock);

      const { req, res } = setupExpressMock({
        req: { body: { salaryId: 1, status: 'paid' } },
      });

      await SalaryController.updateSalaryStatus(req, res);

      expect(SalaryService.updateSalaryStatus).toHaveBeenCalledWith(1, 'paid');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Salary status updated successfully.",
        data: salaryMock,
      });
    });
  });

  describe('getFinanceStats', () => {
    it('should return finance statistics', async () => {
      SalaryService.getFinanceStats.mockResolvedValue(statsMock);

      const { req, res } = setupExpressMock();

      await SalaryController.getFinanceStats(req, res);

      expect(SalaryService.getFinanceStats).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Finance statistics retrieved successfully.",
        data: statsMock,
      });
    });
  });

  describe('getFinanceRecap', () => {
    it('should return finance recap', async () => {
      SalaryService.getFinanceRecap.mockResolvedValue(recapMock);

      const { req, res } = setupExpressMock();

      await SalaryController.getFinanceRecap(req, res);

      expect(SalaryService.getFinanceRecap).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Finance recap retrieved successfully.",
        data: recapMock,
      });
    });
  });
});