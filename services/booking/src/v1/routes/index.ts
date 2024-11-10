import { Router } from 'express';
import {
  confirmBookingController,
  createBookingController,
  createProviderController,
  createPaymentController,
} from '@/v1/controllers';

const router = Router();

router.post('/bookings', createBookingController);
router.post('/bookings/:id/confirm', confirmBookingController);

router.post('/payments', createPaymentController);
router.post('/providers', createProviderController);

export default router;
