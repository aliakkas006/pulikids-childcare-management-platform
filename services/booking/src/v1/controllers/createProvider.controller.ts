import { Response, Request, NextFunction } from 'express';
import CustomError from '@/utils/Error';
import { ProviderCreateSchema } from '../schemas';
import bookingService from '../lib/BookingService';

const createProviderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body using Zod
    const parsedBody = ProviderCreateSchema.safeParse(req.body);

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

    // Check provider existence
    const existingProvider = await bookingService.getProviderByEmail(
      parsedBody.data.email
    );

    if (existingProvider) {
      const error = CustomError.badRequest({
        message: 'This Provider is already exist',
        errors: ['Check the email'],
        hints: 'Please check the request body and try again later',
      });
      return next(error);
    }

    // Create a new provider
    const provider = await bookingService.createProvider(parsedBody.data);

    // Generate response
    const response = {
      message: 'Childcare Provider created successfully',
      data: {
        ...provider,
        links: {
          self: req.url,
          delete: `/providers/${provider.id}`,
        },
      },
      trace_id: req.headers['x-trace-id'],
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default createProviderController;
