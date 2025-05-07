import { AttendanceService } from "../services/attendance.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

/**
 * Handles attendance with status "masuk".
 *
 * @async
 * @function absenMasuk
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the created attendance record.
 */
async function absenMasuk(req, res) {
    const { scheduleId } = req.body; 
    const userId = res.locals.user.id;

    const attendance = await AttendanceService.createAttendance({
        scheduleId,
        userId,
        status: "masuk",
    });

    res.status(201).json({
        message: "Attendance recorded successfully",
        data: attendance,
    });
}

/**
 * Handles attendance with status "izin".
 *
 * @async
 * @function absenIzin
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the created attendance record.
 */
async function absenIzin(req, res) {
    const { scheduleId, reason } = req.body;
    const userId = res.locals.user.id;

    if (!reason) {
        return res.status(400).json({ message: "Reason is required for izin" });
    }

    const attendance = await AttendanceService.createAttendance({
        scheduleId,
        userId,
        status: "izin",
        reason,
    });

    res.status(201).json({
        message: "Attendance recorded successfully",
        data: attendance,
    });
}

/**
 * Handles the request to mark attendance as 'alpha' for missed schedules.
 *
 * @function markAlphaAttendance
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with a success message.
 */
async function markAlphaAttendance(req, res) {
  await AttendanceService.markAlphaForMissedSchedules();
  res.status(200).json({ message: 'Alpha attendance marked for missed schedules.' });
}

/**
 * Handles the request to get attendance statistics for a class.
 *
 * @async
 * @function getAttendanceStatistics
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the attendance statistics for the class.
 */
async function getAttendanceStatistics(req, res) {
    const stats = await AttendanceService.getAttendanceStatistics();

    res.status(200).json({
        message: "Attendance statistics retrieved successfully",
        data: stats,
    });
}

/**
 * Handles the request to get attendance statistics for the logged-in user.
 *
 * @async
 * @function getMyAttendanceStatistics
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the attendance statistics for the user's classes.
 */
async function getMyAttendanceStatistics(req, res) {
    const user = res.locals.user;
    const stats = await AttendanceService.getMyAttendanceStatistics(user);
    res.status(200).json(stats);
  }

export const AttendanceController = {
    absenMasuk: asyncWrapper(absenMasuk),
    absenIzin: asyncWrapper(absenIzin),
    markAlphaAttendance: asyncWrapper(markAlphaAttendance),
    getAttendanceStatistics: asyncWrapper(getAttendanceStatistics),
    getMyAttendanceStatistics: asyncWrapper(getMyAttendanceStatistics),
};