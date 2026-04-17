import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  HTTP_STATUS_CREATED,
} from '../constants/httpStatus';
import * as messages from '../constants/errorMessages';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import User from '../models/user';
import { mapMongooseError } from '../utils/mongooseErrors';
import { JWT_SECRET } from '../middlewares/auth';

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError(messages.USER_NOT_FOUND));
    }
    return res.send(user);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new NotFoundError(messages.USER_NOT_FOUND));
    }
    return res.send(user);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    return res.status(HTTP_STATUS_CREATED).send(user);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError(messages.INVALID_CREDENTIALS));
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(new UnauthorizedError(messages.INVALID_CREDENTIALS));
    }
    const token = jwt.sign(
      { _id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    return res.send({ token });
  } catch (err) {
    return next(mapMongooseError(err));
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError(messages.USER_NOT_FOUND));
    }
    return res.send(user);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError(messages.USER_NOT_FOUND));
    }
    return res.send(user);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};
