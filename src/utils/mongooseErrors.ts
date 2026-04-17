import mongoose from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError';
import { ConflictError } from '../errors/ConflictError';
import * as messages from '../constants/errorMessages';

export function mapMongooseError(err: unknown): Error {
  if (err instanceof mongoose.Error.ValidationError) {
    return new BadRequestError(messages.INCORRECT_DATA);
  }
  if (err instanceof mongoose.Error.CastError) {
    return new BadRequestError(messages.INCORRECT_DATA);
  }
  if (
    typeof err === 'object'
    && err !== null
    && 'code' in err
    && (err as { code: number }).code === 11000
  ) {
    return new ConflictError(messages.EMAIL_ALREADY_EXISTS);
  }
  return err as Error;
}
