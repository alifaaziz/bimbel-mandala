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
  const { classId } = req.params;
  const schedule = await ScheduleService.getClosestSchedules(classId);
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
  const schedules = await ScheduleService.getSchedulesByRole(res.locals.user.id);
  res.status(200).json({ data: schedules });
}

export const ScheduleController = {
  createSchedules: asyncWrapper(createSchedules),
  reschedule: asyncWrapper(reschedule),
  getClosestSchedules: asyncWrapper(getClosestSchedules),
  getSchedules: asyncWrapper(getSchedules)
};
