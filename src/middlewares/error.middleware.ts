import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';
import { config } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if(err.code === 'P2002') {
    logger.error(`Prisma Unique Constraint Error: ${err.meta?.target}`);
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists.',
    });
  }

  logger.error(`Unhandled Error: ${err.message}`, err);
  
  res.status(500).json({
    success: false,
    message: config.nodeEnv === 'production' ? 'Internal server error' : err.message, 
  });
};