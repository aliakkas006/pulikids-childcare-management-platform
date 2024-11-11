import { Router } from 'express';
import {
  register,
  login,
  logout,
  assignRole,
  resetPassword,
} from '@/v1/controllers';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/assign-role', assignRole);
router.post('/reset-password', resetPassword);

export default router;
