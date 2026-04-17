import { Router } from 'express';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import {
  validateCardIdParam,
  validateCreateCard,
} from '../middleware/validations';

const router = Router();

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.put('/:cardId/likes', validateCardIdParam, likeCard);
router.delete('/:cardId/likes', validateCardIdParam, dislikeCard);
router.delete('/:cardId', validateCardIdParam, deleteCard);

export default router;
