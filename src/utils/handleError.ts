import { Response } from 'express';
import mongoose from 'mongoose';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from '../constants/httpStatus';

export function sendError(res: Response, status: number, message: string) {
  return res.status(status).send({ message });
}

export function handleControllerError(err: unknown, res: Response) {
  if (err instanceof mongoose.Error.ValidationError) {
    return sendError(res, HTTP_STATUS_BAD_REQUEST, 'Переданы некорректные данные');
  }
  if (err instanceof mongoose.Error.CastError) {
    return sendError(res, HTTP_STATUS_BAD_REQUEST, 'Переданы некорректные данные');
  }
  return sendError(res, HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка');
}
