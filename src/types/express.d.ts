import { Request, ParamsDictionary } from 'express';

export interface AuthRequest<P = ParamsDictionary> extends Request<P> {
  user?: {
    userId: string;
  };
}