import { prisma } from "../utils/db.js";

/**
 * Retrieves all notifications for a user.
 *
 * @async
 * @function getNotifications
 * @param {string} userId - The user ID.
 * @returns {Promise<Array>} The user's notifications.
 */
async function getNotifications(userId) {
  return prisma.notification.findMany({
    where: { userId, viewed: false },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Marks a notification as read.
 *
 * @async
 * @function markNotificationAsRead
 * @param {string} userId - The user ID.
 * @param {string} notificationId - The notification ID.
 * @returns {Promise<void>} A promise that resolves when the notification is marked as read.
 */
async function markNotificationAsRead(userId, notificationId) {
  await prisma.notification.findFirst({
    where: { id: notificationId, userId }
  });

  await prisma.notification.update({
    where: { id: notificationId },
    data: { viewed: true }
  });
}

/**
 * Marks all notifications as read.
 * 
 * @async
 * @function markAllNotificationsAsRead
 * @param {string} userId - The user ID.
 * @returns {Promise<void>} A promise that resolves when all notifications are marked as read.
 */
async function markAllNotificationsAsRead(userId) {
  await prisma.notification.updateMany({
    where: { userId, viewed: false },
    data: { viewed: true }
  });
}

/**
 * Deletes a notification.
 * 
 * @async
 * @function deleteNotification
 * @param {string} userId - The user ID.
 * @param {string} notificationId - The notification ID.
 * @returns {Promise<void>} A promise that resolves when the notification is deleted.
 */
async function deleteNotification(userId, notificationId) {
  await prisma.notification.findFirst({
    where: { id: notificationId, userId }
  });

  await prisma.notification.delete({
    where: { id: notificationId }
  });
}

/**
 * Retrieves all notifications (admin only).
 *
 * @async
 * @function getAllNotifications
 * @returns {Promise<Array>} All notifications in the system.
 */
async function getAllNotifications() {
  const notifications = await prisma.notification.findMany({
    select: {
      id: true,
      type: true,
      createdAt: true,
      description: true,
      user: {
        select: {
          id: true,
          name: true,
          role: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const enrichedNotifications = notifications.map((notification) => {
    const { description, type } = notification;

    if (['Program', 'Perubahan Jadwal', 'Izin', 'Absensi'].includes(type) && description) {
      const match = description.match(/<b>(.*?)<\/b>.*?<b>(.*?) #([A-Z0-9]+)<\/b>/);
      const programName = match ? match[2] : null;
      const classCode = match ? match[3] : null;

      return {
        id: notification.id,
        type: notification.type,
        createdAt: notification.createdAt,
        user: notification.user,
        programName,
        classCode
      };
    }

    return {
      id: notification.id,
      type: notification.type,
      createdAt: notification.createdAt,
      user: notification.user,
      programName: null,
      classCode: null
    };
  });

  return enrichedNotifications;
}

export const NotificationService = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getAllNotifications
};