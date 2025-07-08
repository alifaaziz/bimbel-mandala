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
async function deleteNotification() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await prisma.notification.deleteMany({
    where: {
      createdAt: { lt: thirtyDaysAgo }
    }
  });
  return result.count;
}

export const NotificationService = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};