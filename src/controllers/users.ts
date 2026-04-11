import { Request, Response } from 'express';
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
} from '../constants/httpStatus';
import User from '../models/user';
import { handleControllerError, sendError } from '../utils/handleError';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return sendError(res, HTTP_STATUS_NOT_FOUND, 'Запрашиваемый пользователь не найден');
    }
    return res.send(user);
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(HTTP_STATUS_CREATED).send(user);
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return sendError(res, HTTP_STATUS_NOT_FOUND, 'Запрашиваемый пользователь не найден');
    }
    return res.send(user);
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return sendError(res, HTTP_STATUS_NOT_FOUND, 'Запрашиваемый пользователь не найден');
    }
    return res.send(user);
  } catch (err) {
    return handleControllerError(err, res);
  }
};
