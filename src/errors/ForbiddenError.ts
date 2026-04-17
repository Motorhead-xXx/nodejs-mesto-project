import { HTTP_STATUS_FORBIDDEN } from '../constants/httpStatus';

export class ForbiddenError extends Error {
  public statusCode = HTTP_STATUS_FORBIDDEN;

  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}
