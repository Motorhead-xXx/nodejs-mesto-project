import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

const requestLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, message }) => `${String(timestamp)} ${message}`,
    ),
  ),
  transports: [new winston.transports.File({ filename: 'request.log' })],
});

export function requestLogMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const line = `${req.method} ${req.originalUrl} — ${res.statusCode} — ${Date.now() - start}ms`;
    requestLogger.info(line);
  });
  next();
}
