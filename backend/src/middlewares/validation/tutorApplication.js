import { z } from 'zod';
import { HttpError } from '../../utils/error.js';
import { formatZodError } from '../../utils/validation.js';

const validApplyTutorPayload = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8).max(20),
    birthDate: z.string(),
    gender: z.string(),
    address: z.string(),
    subjects: z.string(),
    status: z.string(),
    major: z.string(),
    school: z.string(),
    teachLevel: z.string(),
    description: z.string(),
    days: z.union([
        z.string(), // "Senin" atau "Senin,Kamis"
        z.array(z.string()) // ["Senin", "Kamis"]
    ]),
    photo: z
        .object({
            mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg']),
            size: z.number().max(2 * 1024 * 1024)
        })
        .optional()
});

/** @typedef {z.infer<typeof validApplyTutorPayload>} ValidApplyTutorPayload */
/**
 * Validates the payload for applying as a tutor.
 *
 * @param {Request<unknown, unknown, ValidApplyTutorPayload>} req
 * @param {Response} _res
 * @param {NextFunction} next
 * @throws {HttpError} Throws an error if the payload is invalid.
 */
function isValidApplyTutorPayload(req, res, next) {
    const { success, error } = validApplyTutorPayload.safeParse(req.body);

    if (!success) {
        throw new HttpError(400, formatZodError(error));
    }

    if (req.file) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new HttpError(400, 'Foto harus bertipe PNG/JPEG/JPG');
        }
        if (req.file.size > 2 * 1024 * 1024) {
            throw new HttpError(400, 'Ukuran foto maksimal 2MB');
        }
    }

    next();
}

export const TutorApplicationValidation = {
    isValidApplyTutorPayload
};