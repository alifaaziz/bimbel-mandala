import { HttpError } from '../utils/error.js';
import { logger } from '../loaders/pino.js';

export default function errorMiddleware(app) {
  app.use(notFound);
  app.use(errorHandler);
};

/**
 * Middleware to handle 404 errors.
 *
 * This middleware is used to catch all requests that do not match any route.
 * It creates a new HttpError with status code 404 and passes it to the next middleware.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} _res - The Express response object (unused).
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export function notFound(req, _res, next) {
  const notFoundError = new HttpError(404, {
    message: `Route not found - ${req.originalUrl}`
  });

  next(notFoundError);
}

/**
 * Error handling middleware for Express.
 *
 * This middleware handles different types of errors and sends appropriate
 * responses to the client. It distinguishes between expected HTTP errors
 * and unexpected errors, logging them accordingly.
 *
 * @param {Error} err - The error object.
 * @param {import('express').Request} _req - The Express request object (unused).
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} _next - The Express next middleware function (unused).
 * @throws {HttpError} If the error is an instance of HttpError, it sends a response with the error's status code and message.
 * @throws {Error} If the error is an instance of Error, it sends a 500 response with the error's message.
 * @throws {Error} If the error is unknown, it sends a 500 response with a generic message.
 */
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    logger.info(err, `Expected error handler - ${err.message}`);
    res
      .status(err.statusCode)
      .json({ error: { message: err.message, errors: err.errors } });
    return;
  }

  if (err instanceof Error) {
    logger.error(err, `Unexpected error handler - ${err.message}`);
    res.status(500).json({ error: { message: err.message } });
    return;
  }

  logger.error(err, 'Unknown error handler');
  res.status(500).json({ error: { message: 'Internal server error' } });
}