import { HTTP_STATUS_UNAUTHORIZED } from '../constants/httpStatus';

export class UnauthorizedError extends Error {
  public statusCode = HTTP_STATUS_UNAUTHORIZED;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
