import { AuthService } from '../services/auth.js';

/**
 * Middleware to check if the user is authorized.
 * Extracts the authorization token from the request, verifies it, and attaches the user information to the response locals.
 * 
 * @async
 * @function isAuthorized
 * @param {Object} req - The request object.
 * @param {Object} req.headers - The headers of the request.
 * @param {Object} res - The response object.
 * @param {Object} res.locals - The locals object of the response.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the middleware completes.
 * @throws {Error} If the token is invalid or verification fails.
 */
async function isAuthorized(req, res, next) {
  const token = AuthService.getAuthorizationBearerToken(req);

  const user = await AuthService.verifyToken(token);

  res.locals.user = user;

  next();
}

export const AuthMiddleware = {
  isAuthorized
};