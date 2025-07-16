import { prisma } from '../utils/db.js';

/**
 * Create a new payment
 * @param {Object} data
 * @param {string} data.platform
 * @param {string} data.accountNumber
 * @returns {Promise<Object>}
 */
export async function createPayment({ platform, accountNumber }) {
  return await prisma.payment.create({
    data: { platform, accountNumber }
  });
}

/**
 * Get all payments
 * @returns {Promise<Array>}
 */
export async function getPayments() {
  return await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Update payment by ID
 * @param {string} id
 * @param {Object} data
 * @param {string} [data.platform]
 * @param {string} [data.accountNumber]
 * @returns {Promise<Object>}
 */
export async function updatePayment(id, { platform, accountNumber }) {
  return await prisma.payment.update({
    where: { id },
    data: {
      ...(platform && { platform }),
      ...(accountNumber && { accountNumber }),
      updatedAt: new Date()
    }
  });
}

/**
 * Delete payment by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function deletePayment(id) {
  return await prisma.payment.delete({ where: { id } });
}