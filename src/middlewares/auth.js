import { AuthService } from '../services/auth.js';

/** @import {Request,Response,NextFunction} from 'express' */
/** @import {OmittedModel} from '../utils/db.js' */

/**
 * @param {Request} req
 * @param {Response<unknown, { user: OmittedModel<'user'> }>} res
 * @param {NextFunction} next
 */
async function isAuthorized(req, res, next) {
  const token = AuthService.getAuthorizationBearerToken(req);

  const user = await AuthService.verifyToken(token);

  res.locals.user = user;

  next();
}

export const authMiddleware = {
  isAuthorized
};