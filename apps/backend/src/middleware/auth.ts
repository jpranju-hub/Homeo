import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/auth.js';
import { sendError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Missing or invalid authorization header', 401);
    }

    const token = authHeader.substring(7);

    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      return sendError(res, 'Invalid or expired token', 401);
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return sendError(res, 'Authentication failed', 500);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'User not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    next();
  };
};
