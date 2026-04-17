import { NextFunction, Request, Response } from 'express';
import {
  HTTP_STATUS_CREATED,
} from '../constants/httpStatus';
import * as messages from '../constants/errorMessages';
import { ForbiddenError } from '../errors/ForbiddenError';
import { NotFoundError } from '../errors/NotFoundError';
import Card from '../models/card';
import { mapMongooseError } from '../utils/mongooseErrors';

export const getCards = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({
      name,
      link,
      owner: req.user._id,
    });
    return res.status(HTTP_STATUS_CREATED).send(card);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return next(new NotFoundError(messages.CARD_NOT_FOUND));
    }
    if (card.owner.toString() !== req.user._id) {
      return next(new ForbiddenError(messages.FORBIDDEN_DELETE_CARD));
    }
    await Card.findByIdAndDelete(req.params.cardId);
    return res.send(card);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError(messages.CARD_NOT_FOUND));
    }
    return res.send(card);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError(messages.CARD_NOT_FOUND));
    }
    return res.send(card);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};
