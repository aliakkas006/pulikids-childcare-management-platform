import { Response, Request, NextFunction } from 'express';
import activityService from '@/v1/lib/ActivityService';
import CustomError from '@/utils/Error';

const deleteActivityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = CustomError.badRequest({
        message: 'Validation Error',
        errors: ['id is required'],
        hints: 'Please provide the id of the activity to be deleted',
      });
      return next(error);
    }

    const deletedActivity = await activityService.deleteActivity(id);

    console.log(deletedActivity);

    res.status(200).json({
      message: 'Activity Deleted Successfully',
      data: {
        id: deletedActivity.id,
        name: deletedActivity.name,
        type: deletedActivity.type,
        links: {
          self: req.url,
          create: `/activities`,
          get: `/activities/${deletedActivity.id}`,
        },
      },
      trace_id: req.headers['x-trace-id'],
    });
  } catch (err) {
    const error = CustomError.serverError(err);
    next(error);
  }
};

export default deleteActivityController;
