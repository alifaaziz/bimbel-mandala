import { prisma } from '../utils/db.js';
import { ClassService } from './class.js';
import { ScheduleService } from './schedule.js';

/**
 * Creates a new order.
 *
 * @async
 * @function createOrder
 * @param {Object} data - The order data.
 * @returns {Promise<Object>} The created order.
 */
async function createOrder(userId, packageId, groupTypeId, address) {

  await prisma.order.create({
    data: {
      userId,
      packageId,
      groupTypeId,
      address,
      status: 'pending'
    }
  });

  await prisma.bimbelPackage.update({
    where: {
      id: packageId
    },
    data: {
      isActive: false
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
    },
    include: {
      bimbelPackage: {
        include: {
          user: true
        }
      }
    }
  });

  if (status === 'paid') {
    const newClass = await ClassService.createClass({ orderId });
    await ScheduleService.createSchedules(newClass.id);

    const { name: packageName, level, userId } = order.bimbelPackage;
    const tutor = await prisma.tutor.findUnique({
      where: { userId },
      include: { user: true }
    });

    const tutorName = tutor?.user?.name || 'Tutor';
    const genderPrefix = tutor?.gender === 'Male' ? 'Pak' : 'Bu';

    const studentDescription = `Selamat, Bimbingan belajar <b>${packageName} ${level} #${newClass.code}</b> bersama <b>${genderPrefix} ${tutorName}</b> sudah terkonfirmasi dan segera berlangsung.`;
    await prisma.notification.create({
      data: {
        userId: order.userId,
        type: 'Program',
        description: studentDescription
      }
    });

    const tutorDescription = `Selamat, Bimbingan belajar <b>${packageName} ${level} #${newClass.code}</b> sudah terkonfirmasi dan segera berlangsung.`;
    await prisma.notification.create({
      data: {
        userId: tutor.userId,
        type: 'Program',
        description: tutorDescription
      }
    });
  } else {
    await prisma.notification.create({
      data: {
        userId: order.userId,
        type: 'Program',
        description: `The order status has been updated to <b>${status}</b>`
      }
    });
  }

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