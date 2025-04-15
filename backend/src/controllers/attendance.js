import { createAttendance } from "../services/attendance.js";
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

    const attendance = await createAttendance({
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

    const attendance = await createAttendance({
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

export const AttendanceController = {
    absenMasuk: asyncWrapper(absenMasuk),
    absenIzin: asyncWrapper(absenIzin),
};