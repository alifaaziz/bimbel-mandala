import { ScheduleService } from '../services/schedule.js';

/**
 * Handles the request to create schedules for a class.
 *
 * @async
 * @function createSchedules
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the created schedules.
 */
async function createSchedules(req, res) {
  try {
    const { classId } = req.body;
    const schedules = await ScheduleService.createSchedules(classId);
    res.status(201).json({ data: schedules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export const ScheduleController = {
  createSchedules
};