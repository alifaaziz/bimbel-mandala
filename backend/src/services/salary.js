import { prisma } from '../utils/db.js';

/**
 * Creates a salary record.
 *
 * @async
 * @function createSalary
 * @param {Object} data - The salary data.
 * @param {string} data.tutorId - The tutor ID.
 * @param {string} data.orderId - The order ID.
 * @param {number} data.totalSalary - The total salary amount.
 * @returns {Promise<Object>} The created salary record.
 */
async function createSalary({ tutorId, orderId, totalSalary }) {
    const salary = await prisma.salary.create({
        data: {
            userId: tutorId,
            orderId,
            total: totalSalary,
            status: 'pending'
        }
    });

    return salary;
}

/**
 * Updates the status of a salary record.
 * 
 * @async
 * @function updateSalaryStatus
 * @param {string} salaryId - The ID of the salary record.
 * @param {string} status - The new status of the salary record.
 * @returns {Promise<Object>} The updated salary record.
 */
async function updateSalaryStatus(salaryId, status) {
    const salary = await prisma.salary.update({
        where: {
            id: salaryId
        },
        data: {
            status
        }
    });

    return salary;
}


export const SalaryService = {
    createSalary,
    updateSalaryStatus
};