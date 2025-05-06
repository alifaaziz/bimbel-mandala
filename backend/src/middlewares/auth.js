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
  try{
    const token = AuthService.getAuthorizationBearerToken(req);

  const user = await AuthService.verifyToken(token);

  res.locals.user = user;

  next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to restrict access based on user roles.
 *
 * @param {Array<string>} allowedRoles - An array of roles that are allowed to access the route.
 * @returns {Function} Middleware function.
 */
function hasRole(allowedRoles) {
  return (req, res, next) => {
    try {
      const user = res.locals.user;

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const AuthMiddleware = {
  isAuthorized,
  hasRole
};