import { Response, Request, NextFunction } from 'express';
import CustomError from '@/utils/Error';
import bookingService from '../lib/BookingService';
import emailService from '../lib/EmailService';
import { clerkClient } from '@clerk/express';

const confirmBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Retrieve booking by ID
    const booking = await bookingService.getBooking(id);
    if (!booking) {
      const error = CustomError.notFound({
        message: 'Booking not found',
        errors: ['The booking with the provided ID does not exist'],
        hints: 'Please provide a valid booking ID',
      });
      return next(error);
    }

    // Update the booking status to confirmed
    booking.isConfirmed = true;
    await booking.save();

    // Retrieve user using Clerk
    const user = await clerkClient.users.getUser(booking.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Send confirmation email to user
    await emailService.processEmailBooking(
      user.emailAddresses[0].emailAddress,
      booking.bookingDate
    );

    // Filtered booking data to prevent exposing sensitive fields
    const bookingData = {
      id: booking.id,
      isConfirmed: booking.isConfirmed,
      bookingDate: booking.bookingDate,
    };

    // Generate response
    const response = {
      message: 'Booking Confirmed',
      data: {
        ...bookingData,
        links: {
          self: req.url,
          payment: `/bookings/${booking.id}/payment`,
        },
      },
      trace_id: req.headers['x-trace-id'],
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default confirmBookingController;
