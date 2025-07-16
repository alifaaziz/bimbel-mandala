import { z } from 'zod';
import { HttpError } from '../../utils/error.js';
import { formatZodError } from '../../utils/validation.js';

const validCreateOrderPayload = z.object({
    packageId: z.string().min(1, 'packageId wajib diisi'),
    groupTypeId: z.string().min(1, 'groupTypeId wajib diisi'),
    address: z.string().min(5, 'Alamat wajib diisi'),
    paymentId: z.string().min(1, 'paymentId wajib diisi')
});

/** @typedef {z.infer<typeof validCreateOrderPayload>} ValidCreateOrderPayload */
/**
 * Validates the payload for creating an order.
 *
 * @param {Request<unknown, unknown, ValidCreateOrderPayload>} req
 * @param {Response} _res
 * @param {NextFunction} next
 * @throws {HttpError} Throws an error if the payload is invalid.
 */
function isValidCreateOrderPayload(req, _res, next) {
    const { success, error } = validCreateOrderPayload.safeParse(req.body);

    if (!success) {
        throw new HttpError(400, formatZodError(error));
    }

    next();
}

const validUpdateOrderPayload = z.object({
    orderId: z.string().min(1, 'orderId wajib diisi'),
    status: z.string().min(1, 'Status wajib diisi')
});

/** @typedef {z.infer<typeof validUpdateOrderPayload>} ValidUpdateOrderPayload */
/**
 * Validates the payload for updating an order.
 *
 * @param {Request<unknown, unknown, ValidUpdateOrderPayload>} req
 * @param {Response} _res
 * @param {NextFunction} next
 * @throws {HttpError} Throws an error if the payload is invalid.
 */
function isValidUpdateOrderPayload(req, _res, next) {
    const { success, error } = validUpdateOrderPayload.safeParse(req.body);

    if (!success) {
        throw new HttpError(400, formatZodError(error));
    }

    next();
}

export const OrderValidationMiddleware = {
    isValidCreateOrderPayload,
    isValidUpdateOrderPayload
};