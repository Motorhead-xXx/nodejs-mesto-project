import { HTTP_STATUS_BAD_REQUEST } from '../constants/httpStatus';

export class BadRequestError extends Error {
  public statusCode = HTTP_STATUS_BAD_REQUEST;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}
