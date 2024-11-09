import { Response, Request, NextFunction } from 'express';
import { ActivityCreateSchema } from '@/v1/schemas';
import activityService from '@/v1/lib/ActivityService';
import CustomError from '@/utils/Error';

const createActivityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body using Zod
    const parsedBody = ActivityCreateSchema.safeParse(req.body);

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

    // Create the activity
    const activity = await activityService.createActivity(parsedBody.data);

    // Generate response
    const response = {
      message: 'Activity created successfully',
      data: {
        ...activity,
        links: {
          self: req.url,
          get: `/activities/${activity.id}`,
          update: `/activities/${activity.id}`,
          delete: `/activities/${activity.id}`,
        },
      },
      trace_id: req.headers['x-trace-id'],
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default createActivityController;
