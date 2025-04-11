import { NotificationService } from "../services/notification.js";

/**
 * Retrieves all notifications for the current user.
 * 
 * @async
 * @function getNotifications
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the notifications.
 */
async function getNotifications(req, res) {
  const notifications = await NotificationService.getNotifications(res.locals.user.id);
  res.status(200).json({ data: notifications });
}

/**
 * Marks a notification as read.
 * 
 * @async
 * @function markNotificationAsRead
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with no value.
 */
async function markNotificationAsRead(req, res) {
  await NotificationService.markNotificationAsRead(res.locals.user.id, req.params.id);
  res.status(200).json({ message: 'Notification marked as read' });
}

/**
 * Marks all notifications as read.
 * 
 * @async
 * @function markAllNotificationsAsRead
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with no value.
 */
async function markAllNotificationsAsRead(req, res) {
    await NotificationService.markAllNotificationsAsRead(res.locals.user.id);
    res.status(200).json({ message: 'All notifications marked as read' });
}

/**
 * Deletes a notification.
 * 
 * @async
 * @function deleteNotification
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with no value.
 */
async function deleteNotification(req, res) {
  await NotificationService.deleteNotification(res.locals.user.id, req.params.id);
  res.status(200).json({ message: 'Notification deleted' });
}

/**
 * Gets all notifications for a admin
 * 
 * @async
 * @function getAllNotifications
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the notifications.
 */
async function getAllNotifications(req, res) {
  const notifications = await NotificationService.getAllNotifications();
  res.status(200).json({ data: notifications });
}

export const NotificationController = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getAllNotifications
};