import { Router } from 'express';
import {
  getCurrentUser,
  getUserById,
  getUsers,
  updateAvatar,
  updateProfile,
} from '../controllers/users';
import {
  validateUpdateAvatar,
  validateUpdateProfile,
  validateUserIdParam,
} from '../middleware/validations';

const router = Router();

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);
router.get('/:userId', validateUserIdParam, getUserById);

export default router;
