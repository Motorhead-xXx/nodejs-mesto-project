import { Request, Response } from 'express';
import {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
} from '../constants/httpStatus';
import Card from '../models/card';
import { handleControllerError, sendError } from '../utils/handleError';

export const getCards = async (_req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({
      name,
      link,
      owner: req.user._id,
    });
    return res.status(HTTP_STATUS_CREATED).send(card);
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      return sendError(res, HTTP_STATUS_NOT_FOUND, 'Карточка с указанным _id не найдена');
    }
    return res.send(card);
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return sendError(res, HTTP_STATUS_NOT_FOUND, 'Карточка с указанным _id не найдена');
    }
    return res.send(card);
  } catch (err) {
    return handleControllerError(err, res);
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return sendError(res, HTTP_STATUS_NOT_FOUND, 'Карточка с указанным _id не найдена');
    }
    return res.send(card);
  } catch (err) {
    return handleControllerError(err, res);
  }
};
