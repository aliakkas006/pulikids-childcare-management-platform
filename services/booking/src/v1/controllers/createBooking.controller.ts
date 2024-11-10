import { Response, Request, NextFunction } from 'express';
import CustomError from '@/utils/Error';
import { BookingCreateSchema } from '../schemas';
import bookingService from '../lib/BookingService';
import { clerkClient } from '@clerk/express';

const createBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body using Zod
    const parsedBody = BookingCreateSchema.safeParse(req.body);

    // Check if the parsing was successful
    if (!parsedBody.success) {
      const error = CustomError.badRequest({
        message: 'Invalid request body',
        errors: parsedBody.error.errors,
        hints: 'Please check the request body and try again later',
      });
      res.status(error.status).json(error);
      return;
    }

    const { userId, providerId, bookingDate, timeSlot } = parsedBody.data;

    // Check user existence
    await clerkClient.users.getUser(userId);

    // Check provider existence
    const existingProvider = await bookingService.getProvider(providerId);
    if (!existingProvider) {
      const error = CustomError.notFound({
        message: 'This Provider is not found',
        errors: ['Check the provider id'],
        hints: 'Please check the request body and try again later',
      });
      return next(error);
    }

    // Check if the slot is available
    const isAvailable = await bookingService.checkAvailability(
      providerId,
      new Date(bookingDate),
      timeSlot
    );

    if (!isAvailable) {
      const error = CustomError.badRequest({
        message: 'Selected time slot is not available',
        errors: ['Check the time slot'],
        hints: 'Please check the requested time slot and try again later',
      });
      return next(error);
    }

    // Proceed with booking if available
    const booking = await bookingService.createBooking(parsedBody.data);

    // Generate response
    const response = {
      message: 'Booking created successfully',
      data: {
        ...booking,
        links: {
          self: req.url,
          get: `/bookings/${booking.id}`,
          update: `/bookings/${booking.id}`,
          delete: `/bookings/${booking.id}`,
        },
      },
      trace_id: req.headers['x-trace-id'],
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default createBookingController;
