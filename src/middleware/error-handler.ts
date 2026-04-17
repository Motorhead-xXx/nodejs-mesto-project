import { NextFunction, Request, Response } from 'express';
import { isCelebrateError } from 'celebrate';
import winston from 'winston';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from '../constants/httpStatus';
import * as messages from '../constants/errorMessages';
import { BadRequestError } from '../errors/BadRequestError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ForbiddenError } from '../errors/ForbiddenError';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflictError';

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, message }) => `${String(timestamp)} ${message}`,
    ),
  ),
  transports: [new winston.transports.File({ filename: 'error.log' })],
});

function isHttpError(err: unknown): err is Error & { statusCode: number } {
  return (
    err instanceof BadRequestError
    || err instanceof UnauthorizedError
    || err instanceof ForbiddenError
    || err instanceof NotFoundError
    || err instanceof ConflictError
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (isCelebrateError(err)) {
    errorLogger.error(`Validation: ${err.message} ${JSON.stringify(err.details)}`);
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: messages.INCORRECT_DATA });
  }

  if (isHttpError(err)) {
    if (err.statusCode >= HTTP_STATUS_INTERNAL_SERVER_ERROR) {
      errorLogger.error(`${err.name}: ${err.message}`);
    } else {
      errorLogger.error(`${err.name} (${err.statusCode}): ${err.message}`);
    }
    return res.status(err.statusCode).send({ message: err.message });
  }

  errorLogger.error(err instanceof Error ? err.stack ?? err.message : String(err));
  return res
    .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: messages.SERVER_ERROR });
}
