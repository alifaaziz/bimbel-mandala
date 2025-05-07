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

export const SalaryController = {
    updateSalaryStatus: asyncWrapper(updateSalaryStatus)
};