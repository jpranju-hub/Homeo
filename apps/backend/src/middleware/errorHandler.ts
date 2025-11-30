import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('Unhandled error:', error);

  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    return sendError(res, 'Validation error', 400, formattedErrors);
  }

  if (error.statusCode) {
    return sendError(res, error.message, error.statusCode, error.details);
  }

  return sendError(res, 'Internal server error', 500);
};
