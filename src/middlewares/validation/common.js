import { z } from 'zod';
import { HttpError } from '../../utils/error.js';
import { formatZodError } from '../../utils/validation.js';

/** @import {Request, Response, NextFunction} from 'express' */

/**
 * @param {Request<{ id: string }>} req
 * @param {Response} _res
 * @param {NextFunction} next
 */
function isValidParamsIdUuid(req, _res, next) {
    const validUuidSchema = z.string().uuid();

    const result = validUuidSchema.safeParse(req.params.id);

    if (!result.success) {
        throw new HttpError(
            400,
            formatZodError(result.error, {
                preferSingleError: true
            })
        );
    }

    next();
}

const validEmailSchema = z.object({
    email: z.string().email()
});

/** @typedef {z.infer<typeof validEmailSchema>} ValidEmailPayload */

/**
 * @param {Request<unknown, unknown, ValidEmailPayload>} req
 * @param {Response} _res
 * @param {NextFunction} next
 */
function isValidEmailPayload(req, _res, next) {
    const result = validEmailSchema.safeParse(req.body);

    if (!result.success) {
        throw new HttpError(400, formatZodError(result.error));
    }

    next();
}

export const CommonValidationMiddleware = {
    isValidParamsIdUuid,
    isValidEmailPayload
};