import { z } from 'zod';
import { HttpError } from '../../utils/error.js';

const createPaymentSchema = z.object({
  platform: z.string().min(1, 'Platform harus diisi'),
  accountNumber: z.string().min(1, 'Nomor rekening harus diisi')
});

const updatePaymentSchema = z.object({
  platform: z.string().min(1, 'Platform harus diisi').optional(),
  accountNumber: z.string().min(1, 'Nomor rekening harus diisi').optional()
}).refine(data => data.platform || data.accountNumber, {
  message: 'Minimal salah satu field harus diisi'
});

/**
 * Middleware validasi create payment
 */
export function isValidCreatePaymentPayload(req, _res, next) {
  const { success, error } = createPaymentSchema.safeParse(req.body);
  if (!success) {
    throw new HttpError(400, { message: 'Invalid payment payload', details: error });
  }
  next();
}

/**
 * Middleware validasi update payment
 */
export function isValidUpdatePaymentPayload(req, _res, next) {
  const { success, error } = updatePaymentSchema.safeParse(req.body);
  if (!success) {
    throw new HttpError(400, { message: 'Invalid payment update payload', details: error });
  }
  next();
}

export const PaymentValidationMiddleware = {
  isValidCreatePaymentPayload,
  isValidUpdatePaymentPayload
};