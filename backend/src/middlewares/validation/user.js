import { prisma } from '../../utils/db.js';
import { HttpError } from '../../utils/error.js';
import { z } from 'zod';

const passwordSchema = z.string()
    .min(8)
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':",.<>/?\\|`~])/,
        'Password harus mengandung huruf besar, kecil, angka, dan karakter khusus'
    );

/**
 * @param {Request<unknown, ValidEmailPayload>} req
 * @param {Response<unknown, { user: OmittedModel<'user'> }>} res
 * @param {NextFunction} next
 */
export async function isUnverifiedUserExistsPayload(req, res, next) {
  const { email } = req.body;
  
  const user = await prisma.user.findFirst({
    where: { email, verified: false }
  });
  
  if (!user) {
    throw new HttpError(404, { message: 'User not found' });
  }
  
  res.locals.user = user;
  
  next();
}

/**
 * @param {Request<unknown, UpdateUserPayload>} req
 * @param {Response<unknown, { user: OmittedModel<'user'> }>} res
 * @param {NextFunction} next
 */
export async function isValidUserUpdatePayload(_req, res, next) {
  const { id } = res.locals.user;
  
  const user = await prisma.user.findUnique({
    where: { id }
  });
  
  if (!user) {
    throw new HttpError(404, { message: 'User not found' });
  }
  
  next();
}

const valiUpdateUserPayload = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: passwordSchema.optional(),
    role: z.string().optional(),
    level: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    parentPhone: z.string().optional(),
    birthDate: z.string().optional(),
    gender: z.string().optional(),
    subjects: z.string().optional(),
    status: z.string().optional(),
    major: z.string().optional(),
    school: z.string().optional(),
    teachLevel: z.string().optional(),
    description: z.string().optional(),
    percent: z.number().optional(),
    days: z.string().optional(),
});

/** @typedef {z.infer<typeof valiUpdateUserPayload>} UpdateUserPayload */
/**
 * @param {Request<unknown, unknown, UpdateUserPayload>} req
 * @param {Response} _res
 * @param {NextFunction} next
 */
function isValidUpdatePayload(req, _res, next) {
    const { success, error } = valiUpdateUserPayload.safeParse(req.body);

    if (!success) {
        throw new HttpError(400, { message: 'Invalid user update payload', details: error });
    }

    next();
}

export const UserValidation = {
  isUnverifiedUserExistsPayload,
  isValidUserUpdatePayload,
  isValidUpdatePayload
};