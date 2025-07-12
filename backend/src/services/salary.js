import { prisma } from '../utils/db.js';

/**
 * Helper to get tutor name with prefix Pak/Bu.
 * @param {Object} user - User object (tutor).
 * @returns {string|null} Tutor name with prefix or null.
 */
function getTutorName(user) {
    if (!user) return null;
    const gender = user.tutors?.[0]?.gender;
    const prefix = gender === 'Male' ? 'Pak' : 'Bu';
    return `${prefix} ${user.name}`;
}

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

/**
 * Retrieves financial statistics: total income, total salary, finished classes, and pending salaries.
 *
 * @async
 * @function getFinanceStats
 * @returns {Promise<Object>} The statistics object.
 */
async function getFinanceStats() {
    const orders = await prisma.order.findMany({
        where: { status: 'paid' },
        include: {
            groupType: true
        }
    });
    const totalIncome = orders.reduce((sum, order) => {
        const groupType = order.groupType;
        let price = 0;
        if (groupType) {
            price = groupType.discPrice != null ? groupType.discPrice : groupType.price || 0;
        }
        return sum + (parseInt(price) || 0);
    }, 0);

    const salaries = await prisma.salary.findMany();
    const totalSalary = salaries.reduce((sum, s) => sum + (parseInt(s.total) || 0), 0);

    const finishedClassCount = await prisma.class.count({
        where: { status: 'selesai' }
    });

    const pendingSalaryCount = await prisma.salary.count({
        where: { status: 'pending' }
    });

    return {
        totalIncome,
        totalSalary,
        finishedClassCount,
        pendingSalaryCount
    };
}

/**
 * Retrieves finance recap: order, package, user, tutor, class code, start date, end date, salary status.
 *
 * @async
 * @function getFinanceRecap
 * @returns {Promise<Array>} The finance recap list.
 */
async function getFinanceRecap(search = '', page = 1, limit = 5) {
    const orders = await prisma.order.findMany({
        where: { status: 'paid' },
        include: {
            bimbelPackage: {
                select: { 
                    name: true,
                    user: {
                        select: { 
                            name: true,
                            tutors: {
                                select: { gender: true }
                            }
                        }
                    },
                }
            },
            class: {
                select: {
                    id: true,
                    code: true,
                    status: true,
                    schedules: {
                        select: {
                            meet: true,
                            date: true
                        }
                    }
                }
            },
            salary: {
                select: { createdAt: true, status: true }
            }
        }
    });

    const recap = [];
    for (const order of orders) {
        const tutorName = getTutorName(order.bimbelPackage?.user);

        for (const cls of order.class) {
            if (cls.status !== 'selesai') continue;

            let startDate = null;
            if (cls.schedules?.length) {
                const meet1 = cls.schedules.find(sch => sch.meet === 1);
                startDate = meet1 ? meet1.date : null;
            }

            const endDate = order.salary?.[0]?.createdAt || null;
            const salaryStatus = order.salary?.[0]?.status || null;

            recap.push({
                classId: cls.id,
                packageName: order.bimbelPackage?.name || null,
                tutorName,
                classCode: cls.code || null,
                startDate,
                endDate,
                salaryStatus
            });
        }
    }

    const filteredRecap = search
        ? recap.filter(item =>
            (item.packageName && item.packageName.toLowerCase().includes(search.toLowerCase())) ||
            (item.tutorName && item.tutorName.toLowerCase().includes(search.toLowerCase())) ||
            (item.classCode && item.classCode.toLowerCase().includes(search.toLowerCase()))
        )
        : recap;

    const total = filteredRecap.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedRecap = filteredRecap.slice(offset, offset + limit);

    return {
        data: paginatedRecap,
        total,
        page,
        limit,
        totalPages
    };
}

export const SalaryService = {
    createSalary,
    updateSalaryStatus,
    getFinanceStats,
    getFinanceRecap,
};