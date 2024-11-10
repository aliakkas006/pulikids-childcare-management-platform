import { Response, Request, NextFunction } from 'express';
import Stripe from 'stripe';
import CustomError from '@/utils/Error';
import bookingService from '../lib/BookingService';
import emailService from '../lib/EmailService';
import { clerkClient } from '@clerk/express';
import { PaymentSchema } from '@/v1/schemas';
import { PaymentStatus } from '@/types';
import Payment from '../model/Payment';

const stripe_secret_api_key = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripe_secret_api_key);

const createPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body using Zod
    const parsedBody = PaymentSchema.safeParse(req.body);

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

    const { bookingId, amount } = parsedBody.data;
    const booking = await bookingService.getBooking(bookingId);

    if (!booking) {
      const error = CustomError.notFound({
        message: 'Booking not found',
        errors: ['The booking with the provided id does not exist'],
        hints: 'Please provide a valid booking id',
      });
      return next(error);
    }

    // Create payment in stripe
    await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
    });

    // Create payment in DB
    const payment: any = new Payment(parsedBody.data);
    const transactionId = `txn_${Math.random().toString(36).substring(7)}`;

    // Update the payment status is paid and save random transaction id for this payment
    payment.status = PaymentStatus.PAID;
    payment.transactionId = transactionId;
    await payment.save();

    // Find the user in clerk
    const user = await clerkClient.users.getUser(booking.userId);

    // Send confirmation email
    await emailService.processPaymentConfirmationEmail(
      user.emailAddresses[0].emailAddress
    );

    // Generate response
    const response = {
      message: 'Payment Successful',
      data: {
        ...payment._doc,
        links: {
          self: req.url,
          activities: `/activities`,
          bookings: `/bookings`,
        },
      },
      trace_id: req.headers['x-trace-id'],
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default createPaymentController;
