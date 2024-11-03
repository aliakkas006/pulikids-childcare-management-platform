import { Router } from 'express';
import {
  register,
  login,
  logout,
  assignRole,
  resetPassword,
} from '@/v1/controllers';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.post('/auth/assign-role', assignRole);
router.post('/auth/reset-password', resetPassword);

export default router;
