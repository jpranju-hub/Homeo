import { Router, Request, Response } from 'express';
import { LoginSchema, RegisterSchema } from '@homeo/shared';
import { prisma } from '../index.js';
import {
  createAccessToken,
  createRefreshToken,
  hashPassword,
  comparePasswords,
} from '../utils/auth.js';
import { sendSuccess, sendError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = RegisterSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return sendError(res, 'Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    // Create tokens
    const accessToken = createAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info(`User registered: ${user.email}`);

    return sendSuccess(
      res,
      {
        user,
        accessToken,
        refreshToken,
      },
      'Registration successful',
      201
    );
  } catch (error) {
    logger.error('Registration error:', error);
    if (error instanceof Error) {
      return sendError(res, error.message, 400);
    }
    return sendError(res, 'Registration failed', 500);
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedData = LoginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Compare passwords
    const passwordMatch = await comparePasswords(validatedData.password, user.password);

    if (!passwordMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    // Create tokens
    const accessToken = createAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info(`User logged in: ${user.email}`);

    return sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      'Login successful'
    );
  } catch (error) {
    logger.error('Login error:', error);
    if (error instanceof Error) {
      return sendError(res, error.message, 400);
    }
    return sendError(res, 'Login failed', 500);
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return sendError(res, 'Refresh token is required', 400);
    }

    // Verify refresh token
    const { verifyRefreshToken } = await import('../utils/auth.js');
    const payload = verifyRefreshToken(refreshToken);

    const accessToken = createAccessToken(payload);

    return sendSuccess(res, { accessToken }, 'Token refreshed successfully');
  } catch (error) {
    logger.error('Token refresh error:', error);
    return sendError(res, 'Failed to refresh token', 401);
  }
});

export default router;
