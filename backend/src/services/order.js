import { prisma } from '../utils/db.js';

/**
 * Creates a new order.
 *
 * @async
 * @function createOrder
 * @param {Object} data - The order data.
 * @returns {Promise<Object>} The created order.
 */
async function createOrder(data) {
  const { userId, packageId, address } = data;

  await prisma.order.create({
    data: {
      userId,
      packageId,
      address,
      status: 'pending'
    }
  });
}

/**
 * Updates the status of an order.
 *
 * @async
 * @function updateOrderStatus
 * @param {String} orderId - The ID of the order.
 * @param {String} status - The new status of the order.
 * @returns {Promise<Object>} The updated order.
 */
async function updateOrderStatus(orderId, status) {
  const order = await prisma.order.update({
    where: {
      id: orderId
    },
    data: {
      status
    }
  });

  return order;
}

/**
 * Gets all orders (optional).
 *
 * @async
 * @function getAllOrders
 * @returns {Promise<Array>} The list of orders.
 */
async function getAllOrders() {
  const orders = await prisma.order.findMany();
  return orders;
}

/**
 * Gets an order by ID (optional).
 *
 * @async
 * @function getOrderById
 * @param {String} id - The ID of the order.
 * @returns {Promise<Object>} The order.
 */
async function getOrderById(id) {
  const order = await prisma.order.findUnique({
    where: {
      id: id
    }
  });
  return order;
}

/**
 * Deletes an order by ID (optional).
 *
 * @async
 * @function deleteOrder
 * @param {String} id - The ID of the order.
 * @returns {Promise<Object>} The deleted order.
 */
async function deleteOrder(id) {
  const order = await prisma.order.delete({
    where: {
      id: id
    }
  });
  return order;
}

/**
 * Cancels orders that have been pending for more than 2 days.
 *
 * @async
 * @function cancelPendingOrders
 * @returns {Promise<void>}
 */
async function cancelPendingOrders() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
    const result = await prisma.order.updateMany({
      where: {
        status: 'pending',
        createdAt: {
          lt: twoDaysAgo
        }
      },
      data: {
        status: 'cancel'
      }
    });
  
    console.log(`Orders cancelled: ${result.count}`);
  }

export const OrderService = {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
  deleteOrder,
  cancelPendingOrders
};