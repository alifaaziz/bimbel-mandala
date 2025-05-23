import express from 'express';
import { HttpError } from '../../utils/error.js';
import { logger } from '../../loaders/pino.js';
import { setupExpressMock } from '../../utils/jest.js';

const {
  notFound,
  errorHandler,
  default: errorMiddleware
} = await import('../error.js');

const oldLoggerLevel = logger.level;

describe('Error middleware', () => {
  beforeAll(() => {
    logger.level = 'fatal';
  });

  afterAll(() => {
    logger.level = oldLoggerLevel;
  });

  it('should load the error middleware', () => {
    const app = express();
    expect(() => errorMiddleware(app)).not.toThrow();
  });

  it('should handle a generic Error', () => {
    const err = new Error('Test error');
    const { req, res, next } = setupExpressMock();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Test error' } });
  });

  it('should handle an HttpError', () => {
    const err = new HttpError(400, { message: 'Test error' });
    const { req, res, next } = setupExpressMock();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: { message: 'Test error' } });
  });

  it('should call next with a not found HttpError', () => {
    const { req, res, next } = setupExpressMock({
      req: { originalUrl: '/test' }
    });

    notFound(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: expect.stringContaining('Route not found'),
      })
    );
  });

  it('should handle null error as Internal server error', () => {
    const { req, res, next } = setupExpressMock();
    const err = null;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Internal server error' }
    });
  });
});