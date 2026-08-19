import { prisma } from '../utils/db.js';
import { ClassService } from './class.js';
import { ScheduleService } from './schedule.js';

/**
 * Helper to get tutor name with prefix.
 * @param {Object} tutor - Tutor object (with user and gender).
 * @returns {string} Tutor name with prefix.
 */
function getTutorDisplayName(tutor) {
  const genderPrefix = tutor.gender === 'Male' ? 'Pak' : 'Bu';
  const name = tutor.user?.name || 'Tutor';
  return `${genderPrefix} ${name}`;
}

/**
 * Creates a new order.
 *
 * @async
 * @function createOrder
 * @param {Object} data - The order data.
 * @returns {Promise<Object>} The created order.
 */
async function createOrder(userId, packageId, groupTypeId, address, paymentId) {
  const groupType = await prisma.groupType.findUnique({
    where: { id: groupTypeId }
  });

  let amount = 0;
  if (groupType) {
    if (groupType.discPrice != null && Number(groupType.discPrice) > 0) {
      amount = Number(groupType.discPrice);
    } else {
      amount = Number(groupType.price) || 0;
    }
  }

  await prisma.order.create({
    data: {
      userId,
      packageId,
      groupTypeId,
      address,
      status: 'pending',
      amount,
      paymentId
    }
  });

  if (groupType?.type !== 'kelas') {
    await prisma.bimbelPackage.update({
      where: {
        id: packageId
      },
      data: {
        isActive: false
      }
    });
  }
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
    where: { id: orderId },
    data: { status },
    include: {
      bimbelPackage: { include: { user: true } },
      groupType: true,
      user: true
    }
  });

  if (status === 'paid') {
    if (order.groupType.type === 'kelas') {
      const dummyOrder = await prisma.order.findFirst({
        where: {
          packageId: order.packageId,
          status: 'kelas'
        }
      });

      if (!dummyOrder) throw new Error('Dummy order/class untuk paket ini tidak ditemukan.');

      const kelas = await prisma.class.findFirst({
        where: { orderId: dummyOrder.id }
      });

      if (!kelas) throw new Error('Class untuk paket ini tidak ditemukan.');

      const existingStudent = await prisma.studentClass.findFirst({
        where: {
          userId: order.userId,
          classId: kelas.id
        }
      });
      if (!existingStudent) {
        await prisma.studentClass.create({
          data: {
            userId: order.userId,
            classId: kelas.id
          }
        });
      }

      // Notifikasi, dsb, bisa ditambahkan di sini

      return order;
    }

    // --- Flow lama untuk non-kelas ---
    const newClass = await ClassService.createClass({ orderId });
    await ScheduleService.createSchedules(newClass.id);

    const { name: packageName, level, userId } = order.bimbelPackage;

    const tutor = await prisma.tutor.findUnique({
      where: { userId },
      include: { user: true }
    });
    const tutorPhoto = tutor?.photo || null;

    const tutorDisplayName = getTutorDisplayName(tutor);

    const studentDescription = `Selamat, Bimbingan belajar <strong>${packageName} ${level} #${newClass.code}</strong> bersama <strong>${tutorDisplayName}</strong> sudah terkonfirmasi dan segera berlangsung.`;
    await prisma.notification.create({
      data: {
        userId: order.userId,
        type: 'Program',
        description: studentDescription,
        photo: tutorPhoto
      }
    });

    const tutorDescription = `Selamat, Bimbingan belajar <strong>${packageName} ${level} #${newClass.code}</strong> sudah terkonfirmasi dan segera berlangsung.`;
    await prisma.notification.create({
      data: {
        userId: tutor.userId,
        type: 'Program',
        description: tutorDescription,
        photo: tutorPhoto
      }
    });
  } else {
    await prisma.notification.create({
      data: {
        userId: order.userId,
        type: 'Program',
        description: `The order status has been updated to <strong>${status}</strong>`,
        photo: order.bimbelPackage.user?.tutor?.photo
      }
    });
  }

  return order;
}

/**
 * Gets pending orders with pagination.
 *
 * @async
 * @function getPendingOrders
 * @param {Object} options - Pagination options.
 * @param {number} options.page - Page number (1-based).
 * @param {number} options.limit - Items per page.
 * @returns {Promise<Object>} The paginated orders and total count.
 */
async function getPendingOrders({ page = 1, limit = 10 } = {}) {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      where: { status: 'pending' }, 
      orderBy: { createdAt: 'desc' },
      include: {
        bimbelPackage: {
          select: {
            name: true,
            level: true,
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }),
    prisma.order.count({ where: { status: 'pending' } }) 
  ]);

  return {
    data: orders.map(order => ({
      id: order.id,
      packageName: order.bimbelPackage?.name || null,
      level: order.bimbelPackage?.level || null,
      tutorName: order.bimbelPackage?.user?.name || null,
      status: order.status,
    })),
    total,
    page,
    pageSize: limit
  };
}

/**
 * Gets an order by ID (with detail).
 *
 * @async
 * @function getOrderById
 * @param {String} id - The ID of the order.
 * @returns {Promise<Object>} The order detail.
 */
async function getOrderById(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      bimbelPackage: {
        select: {
          name: true,
          level: true,
          area: true,
          totalMeetings: true,
          time: true,
          duration: true,
          slug: true,
          user: { select: { name: true, tutors: { select: { photo: true } } } },
          groupType: {
            select: {
              id: true,
              type: true,
              price: true,
              discPrice: true
            }
          },
          days: true 
        }
      },
      groupType: {
        select: {
          id: true,
          type: true,
          price: true,
          discPrice: true
        }
      },
      payment: {
        select: {
          platform: true
        }
      }
    }
  });

  if (!order) return null;

  const selectedGroupType = order.groupType;

  let paid = null;
  if (selectedGroupType) {
    paid = selectedGroupType.discPrice != null ? selectedGroupType.discPrice : selectedGroupType.price;
  }

  const studentName = order.user?.name || null;

  const packageDays = order.bimbelPackage?.days ? JSON.parse(order.bimbelPackage.days) : [];

  function getNextDateForDay(dayName) {
    const daysMap = {
      'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6, 'Minggu': 0
    };
    const today = new Date();
    const todayDay = today.getDay();
    const targetDay = daysMap[dayName];
    let diff = (targetDay - todayDay + 7) % 7;
    if (diff === 0) diff = 7; 
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);
    return nextDate;
  }

  let nearestDay = null;
  let nearestDate = null;
  if (packageDays.length > 0) {
    let minDiff = 8;
    packageDays.forEach(dayName => {
      const date = getNextDateForDay(dayName);
      const diff = (date - new Date()) / (1000 * 60 * 60 * 24);
      if (diff < minDiff) {
        minDiff = diff;
        nearestDay = dayName;
        nearestDate = date;
      }
    });
  }

  return {
    id: order.id,
    packageName: order.bimbelPackage?.name || null,
    level: order.bimbelPackage?.level || null,
    tutorName: order.bimbelPackage?.user?.name || null,
    area: order.bimbelPackage?.area || null,
    totalMeetings: order.bimbelPackage?.totalMeetings || null,
    time: order.bimbelPackage?.time || null,
    duration: order.bimbelPackage?.duration || null,
    type: selectedGroupType?.type || null,
    paid,
    paymentMethod: order.payment?.platform || null,
    studentName,
    address: order.address,
    startDate: nearestDate ? nearestDate.toISOString().split('T')[0] : null,
    days: packageDays, 
    photo: order.bimbelPackage?.user?.tutors?.[0]?.photo || null,
    slug: order.bimbelPackage?.slug || null,
  };
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
  getPendingOrders,
  getOrderById,
  deleteOrder,
  cancelPendingOrders
};