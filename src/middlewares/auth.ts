import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as messages from '../constants/errorMessages';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';

export function auth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new UnauthorizedError(messages.AUTH_REQUIRED));
  }
  const token = header.replace(/^Bearer\s+/i, '');
  try {
    req.user = jwt.verify(token, JWT_SECRET) as { _id: string };
    return next();
  } catch {
    return next(new UnauthorizedError(messages.INVALID_TOKEN));
  }
}
