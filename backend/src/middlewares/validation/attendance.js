import { z } from 'zod';
import { HttpError } from '../../utils/error.js';
import { formatZodError } from '../../utils/validation.js';

const validCreateAttendancePayload = z.object({
    scheduleId: z.string().min(1, 'scheduleId wajib diisi'),
    reason: z.string().optional()
});

/** @typedef {z.infer<typeof validCreateAttendancePayload>} ValidCreateAttendancePayload */
/**
 * Validates the payload for creating attendance.
 *
 * @param {Request<unknown, unknown, ValidCreateAttendancePayload>} req
 * @param {Response} _res
 * @param {NextFunction} next
 * @throws {HttpError} Throws an error if the payload is invalid.
 */
function isValidCreateAttendancePayload(req, _res, next) {
    const { success, error } = validCreateAttendancePayload.safeParse(req.body);

    if (!success) {
        throw new HttpError(400, formatZodError(error));
    }

    next();
}

export const AttendanceValidationMiddleware = {
    isValidCreateAttendancePayload
};