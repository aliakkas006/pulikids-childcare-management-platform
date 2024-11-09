import { Response, Request, NextFunction } from 'express';
import activityService from '@/v1/lib/ActivityService';
import CustomError from '@/utils/Error';
import { ActivityUpdateSchema } from '../schemas';

const updateActivityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Validate the request body using Zod
    const parsedBody = ActivityUpdateSchema.safeParse(req.body);

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

    // Check if the activity is exist
    const activity = await activityService.getActivity(id);

    if (!activity) {
      const error = CustomError.notFound({
        message: 'Activity not found',
        errors: ['The activity with the provided id does not exist'],
        hints: 'Please provide a valid activity id',
      });
      return next(error);
    }

    const updatedActivity = await activityService.updateActivity(
      id,
      parsedBody.data
    );

    // Generate response
    res.status(201).json({
      message: 'Activity updated successfully',
      data: {
        id: updatedActivity.id,
        links: {
          self: req.url,
          get: `/activities/${updatedActivity.id}`,
          update: `/activities/${updatedActivity.id}`,
          delete: `/activities/${updatedActivity.id}`,
        },
      },
      trace_id: req.headers['x-trace-id'],
    });
  } catch (err) {
    next(err);
  }
};

export default updateActivityController;
