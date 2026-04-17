import { HTTP_STATUS_NOT_FOUND } from '../constants/httpStatus';

export class NotFoundError extends Error {
  public statusCode = HTTP_STATUS_NOT_FOUND;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
