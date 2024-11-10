import { Types } from 'mongoose';
import { z } from 'zod';

export const BookingCreateSchema = z.object({
  userId: z.string(),
  providerId: z.string(),
  childName: z.string().min(3).max(25),
  serviceType: z.string(),
  bookingDate: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date()),
  timeSlot: z.string(),
});

export const ProviderCreateSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  capacity: z.number().int(),
});

export const EmailCreateSchema = z.object({
  recipient: z.string().email(),
  subject: z.string(),
  body: z.string(),
  source: z.string(),
  sender: z.string().email().optional(),
});

// Custom validator for MongoDB ObjectId
const objectIdValidator = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  });

export const PaymentSchema = z.object({
  bookingId: objectIdValidator, // Ensures bookingId is a valid ObjectId
  amount: z.number(),
  currency: z.string().optional(),
  paymentMethod: z.string(),
});
