import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from '../errors/AppError';
import { AuthRequest } from '../types/express';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if(!authHeader || !authHeader.startsWith('Bearer ')) 
    return next(new AppError('No token provided', 401));
  
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};