import { NextFunction, Request, Response } from 'express';
import {
  HTTP_STATUS_CREATED,
} from '../constants/httpStatus';
import * as messages from '../constants/errorMessages';
import { ForbiddenError } from '../errors/ForbiddenError';
import { NotFoundError } from '../errors/NotFoundError';
import Card from '../models/card';
import { mapMongooseError } from '../utils/mongooseErrors';

async function updateCardLikes(
  cardId: string,
  userId: string,
  operator: '$addToSet' | '$pull',
) {
  return Card.findByIdAndUpdate(
    cardId,
    { [operator]: { likes: userId } },
    { new: true },
  );
}

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
    const card = await updateCardLikes(req.params.cardId, req.user._id, '$addToSet');
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
    const card = await updateCardLikes(req.params.cardId, req.user._id, '$pull');
    if (!card) {
      return next(new NotFoundError(messages.CARD_NOT_FOUND));
    }
    return res.send(card);
  } catch (err) {
    return next(mapMongooseError(err));
  }
};
