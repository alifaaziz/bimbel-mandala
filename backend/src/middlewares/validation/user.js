import { prisma } from '../../utils/db.js';
import { HttpError } from '../../utils/error.js';

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

export const UserValidation = {
  isUnverifiedUserExistsPayload,
  isValidUserUpdatePayload
};