import { z } from 'zod';
import { HttpError } from '../../utils/error.js';
import { formatZodError, validStringSchema } from '../../utils/validation.js';

/** @import {Request, Response, NextFunction} from 'express' */

const validLoginPayload = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

/** @typedef {z.infer<typeof validLoginPayload>} ValidLoginPayload */

/**
 * @param {Request<{ id: string }>} req
 * @param {Response} _res
 * @param {NextFunction} next
 */
function isValidLoginPayload(req, _res, next) {
    const { success, error } = validLoginPayload.safeParse(req.body);

    if (!success) {
        throw new HttpError(400, formatZodError(error));
    }

    next();
}

const validResetPasswordPayload = z.object({
    token: z.string(),
    password: z.string().min(8)
});

/** @typedef {z.infer<typeof validResetPasswordPayload>} ValidResetPasswordPayload */

/**
 * @param {Request<unknown, unknown, ValidResetPasswordPayload>} req
 * @param {Response} _res
 * @param {NextFunction} next
 */
function isValidResetPasswordPayload(req, _res, next) {
    const { success, error } = validResetPasswordPayload.safeParse(req.body);

    if (!success) {
        throw new HttpError(400, formatZodError(error));
    }

    next();
}

/**
 * @param {Request<{ token: string }>} req
 * @param {Response} _res
 * @param {NextFunction} next
 */
function isValidTokenParams(req, _res, next) {
    const { success, error } = validStringSchema.safeParse(req.params.token);

    if (!success) {
        throw new HttpError(
            400,
            formatZodError(error, { preferSingleError: true })
        );
    }

    next();
}

const passwordSchema = z.string()
    .min(8)
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':",.<>/?\\|`~])/,
        'Password harus mengandung huruf besar, kecil, angka, dan karakter khusus'
    );

const validRegisterPayload = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: passwordSchema,
    role: z.string(),
    googleId: z.string().optional()
});

/** @typedef {z.infer<typeof validRegisterPayload>} ValidRegisterPayload */

/**
 * @param {Request<unknown, unknown, ValidRegisterPayload>} req
 * @param {Response} _res
 * @param {NextFunction} next
 */
function isValidRegisterPayload(req, _res, next) {
    const { success, error } = validRegisterPayload.safeParse(req.body);

    if (!success) {
        throw new HttpError(400, formatZodError(error));
    }

    next();
}

const validChangePasswordPayload = z.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema
});

/** @typedef {z.infer<typeof validChangePasswordPayload>} ValidChangePasswordPayload */

/**
 * @param {Request<unknown, unknown, ValidChangePasswordPayload>} req
 * @param {Response} _res
 * @param {NextFunction} next
 */
function isValidChangePasswordPayload(req, _res, next) {
    const { success, error } = validChangePasswordPayload.safeParse(req.body);

    if (!success) {
        throw new HttpError(400, formatZodError(error));
    }

    next();
}

const validAddUserPayload = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: passwordSchema,
    role: z.string(),
    birthDate: z.string().optional(),
    phone: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    subjects: z.string().optional(),
    status: z.string().optional(),
    major: z.string().optional(),
    school: z.string().optional(),
    teachLevel: z.string().optional(),
    description: z.string().optional(),
    percent: z.number().optional(),
    days: z.string().optional(),
    photo: z
        .object({
            mimetype: z.enum(['image/png', 'image/jpeg', 'image/jpg']),
            size: z.number().max(2 * 1024 * 1024)
        })
        .optional()
});

/** @typedef {z.infer<typeof validAddUserPayload>} ValidAddUserPayload */
/**
 * Validates the payload for adding a user.
 *
 * @param {Request<unknown, unknown, ValidAddUserPayload>} req - The request object.
 * @param {Response} _res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @throws {HttpError} Throws an error if the payload is invalid.
 */
function isValidAddUserPayload(req, _res, next) {
    const { success, error } = validAddUserPayload.safeParse(req.body);

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

const validAddStudentPayload = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: passwordSchema,
    role: z.string(),
    level: z.string(),
    address: z.string().optional(),
    phone: z.string().optional(),
    parentPhone: z.string().optional()
});

/** @typedef {z.infer<typeof validAddStudentPayload>} ValidAddStudentPayload */
/**
 * Validates the payload for adding a student.
 *
 * @param {Request<unknown, unknown, ValidAddStudentPayload>} req - The request object.
 * @param {Response} _res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @throws {HttpError} Throws an error if the payload is invalid.
 */
function isValidAddStudentPayload(req, _res, next) {
    const { success, error } = validAddStudentPayload.safeParse(req.body);

    if (!success) {
        throw new HttpError(400, formatZodError(error));
    }

    next();
}

export const AuthValidationMiddleware = {
    isValidLoginPayload,
    isValidResetPasswordPayload,
    isValidTokenParams,
    isValidRegisterPayload,
    isValidAddUserPayload,
    isValidChangePasswordPayload,
    isValidAddStudentPayload,
};