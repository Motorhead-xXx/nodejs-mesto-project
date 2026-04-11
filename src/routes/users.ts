import { Router } from 'express';
import {
  createUser,
  getUserById,
  getUsers,
  updateAvatar,
  updateProfile,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/me/avatar', updateAvatar);
router.patch('/me', updateProfile);
router.get('/:userId', getUserById);

export default router;
