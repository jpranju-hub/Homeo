import { Response } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const sendSuccess = (
  res: Response,
  data: unknown,
  message: string = 'Success',
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  details?: unknown
) => {
  res.status(statusCode).json({
    success: false,
    error: message,
    details,
    timestamp: new Date().toISOString(),
  });
};
