import { HTTP_STATUS_CONFLICT } from '../constants/httpStatus';

export class ConflictError extends Error {
  public statusCode = HTTP_STATUS_CONFLICT;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
