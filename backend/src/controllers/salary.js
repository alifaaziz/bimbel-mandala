import { SalaryService } from '../services/salary.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

/**
 * Handles the request to update the status of a salary record.
 *
 * @async
 * @function updateSalaryStatus
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the updated salary record.
 */
async function updateSalaryStatus(req, res) {
    const { salaryId, status } = req.body;

    const updatedSalary = await SalaryService.updateSalaryStatus(salaryId, status);

    res.status(200).json({ message: "Salary status updated successfully.", data: updatedSalary });
}

/**
 * Handles the request to get financial statistics.
 *
 * @async
 * @function getFinanceStats
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the statistics object.
 */
async function getFinanceStats(req, res) {
    const stats = await SalaryService.getFinanceStats();
    res.status(200).json({ message: "Finance statistics retrieved successfully.", data: stats });
}

/**
 * Handles the request to get finance recap.
 *
 * @async
 * @function getFinanceRecap
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the finance recap list.
 */
async function getFinanceRecap(req, res) {
    const recap = await SalaryService.getFinanceRecap();
    res.status(200).json({ message: "Finance recap retrieved successfully.", data: recap });
}

export const SalaryController = {
    updateSalaryStatus: asyncWrapper(updateSalaryStatus),
    getFinanceStats: asyncWrapper(getFinanceStats),
    getFinanceRecap: asyncWrapper(getFinanceRecap)
};