import { ScheduleService } from '../services/schedule.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

/**
 * Handles the request to create schedules for a class.
 *
 * @function createSchedules
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the created schedules.
 */
async function createSchedules(req, res) {
  const { classId } = req.body;
  const schedules = await ScheduleService.createSchedules(classId);
  res.status(201).json({ data: schedules });
}

/**
 * Handles the request to reschedule a specific schedule.
 * 
 * @function reschedule
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the updated schedule.
 */
async function reschedule(req, res) {
  const { id: scheduleId } = req.params;
  const { newDate } = req.body;

  const loggedInUser = res.locals.user;
  const isAdmin = loggedInUser.role === 'admin';
  
  const updatedSchedule = await ScheduleService.reschedule(scheduleId, newDate, req, res, isAdmin);

  res.status(200).json({ data: updatedSchedule });
}

/**
 * Handles the request to get the closest schedule for a class.
 * 
 * @function getClosestSchedules
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the closest schedule.
 */
async function getClosestSchedules(req, res) {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 10; 
  const schedule = await ScheduleService.getClosestSchedules(page, limit);
  res.status(200).json({ data: schedule });
}

/**
 * Handles the request to get schedules for the logged-in user.
 *
 * @function getSchedules
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the user's schedules.
 */
async function getSchedules(req, res) {
  const page = parseInt(req.query.page) || 1; 
  const limit = parseInt(req.query.limit) || 5; 
  const schedules = await ScheduleService.getSchedulesByRole(res.locals.user.id, page, limit);
  res.status(200).json({ data: schedules });
}

/**
 * Handles the request to get schedule detail by schedule ID.
 *
 * @function getScheduleById
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the schedule detail.
 */
async function getScheduleBySlug(req, res) {
  const { slug } = req.params;
  const schedule = await ScheduleService.getScheduleBySlug(slug);
  res.status(200).json({ data: schedule });
}

/**
 * Handles the request to update the information of a specific schedule.
 *
 * @function updateScheduleInformation
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the updated schedule.
 */
async function updateScheduleInformation(req, res) {
  const { id: scheduleId } = req.params;
  const { information } = req.body;
  const updatedSchedule = await ScheduleService.updateScheduleInformation(scheduleId, information);
  res.status(200).json({ data: updatedSchedule });
}

/**
 * Handles the request to get the closest schedule for a specific slug.
 *
 * @function getClosestScheduleBySlug
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the closest schedule detail.
 */
async function getClosestScheduleBySlug(req, res) {
  const { slug } = req.params;
  const schedule = await ScheduleService.getClosestScheduleBySlug(slug);
  res.status(200).json({ data: schedule });
}

/**
 * Handles the request to get schedules by a specific user ID.
 *
 * @function getScheduleByUserId
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the user's schedules.
 */
async function getScheduleByUserId(req, res) {
  const { userId } = req.params;
  const schedules = await ScheduleService.getSchedulesByRole(userId, 1, 5);
  res.status(200).json({ data: schedules });
}

export const ScheduleController = {
  createSchedules: asyncWrapper(createSchedules),
  reschedule: asyncWrapper(reschedule),
  getClosestSchedules: asyncWrapper(getClosestSchedules),
  getSchedules: asyncWrapper(getSchedules),
  getScheduleBySlug: asyncWrapper(getScheduleBySlug),
  updateScheduleInformation: asyncWrapper(updateScheduleInformation),
  getClosestScheduleBySlug: asyncWrapper(getClosestScheduleBySlug),
  getScheduleByUserId: asyncWrapper(getScheduleByUserId)
};
