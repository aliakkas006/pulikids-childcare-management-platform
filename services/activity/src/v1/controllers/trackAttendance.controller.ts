import { Response, Request, NextFunction } from 'express';
import { TrackAttendanceSchema } from '@/v1/schemas';
import activityService from '@/v1/lib/ActivityService';
import CustomError from '@/utils/Error';

const trackAttendancesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body using Zod
    const parsedBody = TrackAttendanceSchema.safeParse(req.body);

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
    const activity = await activityService.getActivity(
      parsedBody.data.activityId
    );

    if (!activity) {
      const error = CustomError.notFound({
        message: 'Activity not found',
        errors: ['The activity with the provided id does not exist'],
        hints: 'Please provide a valid activity id',
      });
      return next(error);
    }

    // Mark the attendance
    const attendance = await activityService.trackAttendance(parsedBody.data);

    // Generate response
    const response = {
      message: 'Attendance marked successfully',
      data: {
        ...attendance,
        links: {
          self: req.url,
          get: `/activities/${parsedBody.data.activityId}/attendances`,
        },
      },
      trace_id: req.headers['x-trace-id'],
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default trackAttendancesController;
