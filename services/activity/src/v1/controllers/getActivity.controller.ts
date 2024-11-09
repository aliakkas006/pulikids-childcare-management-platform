import { Response, Request, NextFunction } from 'express';
import activityService from '@/v1/lib/ActivityService';
import CustomError from '@/utils/Error';
import generateEtag from '@/utils/generateEtag';

const getActivityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Handling the validation of fields that are requested in the query parameters
    const query: any = req.query;
    const fields = query?.fields?.split(',');
    const allowedFields = [
      'name',
      'description',
      'type',
      'location',
      'scheduled_date',
    ];

    const invalidFields = fields?.reduce((acc, field) => {
      if (!allowedFields.includes(field)) {
        acc.push(`'${field}' is not a valid field`);
      }
      return acc;
    }, []);

    if (invalidFields?.length) {
      const error = CustomError.badRequest({
        message: 'Invalid fields',
        errors: invalidFields,
        hints: `Please provide valid fields from [${allowedFields.join(',')}]`,
      });
      return next(error);
    }

    let activity = await activityService.getActivity(id);

    if (!activity) {
      const error = CustomError.notFound({
        message: 'Activity not found',
        errors: ['The activity with the provided id does not exist'],
        hints: 'Please provide a valid activity id',
      });
      return next(error);
    }

    // Filtering the activity object based on the fields requested in the query parameters.
    if (fields) {
      const filteredActivity = fields.reduce(
        (acc, field) => {
          acc[field] = activity[field];
          return acc;
        },
        { id: activity.id }
      );
      activity = filteredActivity;
    }

    // Generate ETag
    const ETag = generateEtag(activity);

    // Check if the ETag matches the one in the request headers
    if (req.headers['if-none-match'] === ETag) {
      console.log('[match etag]', ETag === req.headers['if-none-match']);
      res.status(304).send('Not Modified');
      return;
    }

    // Add Cache Control
    res.setHeader('Etag', ETag);

    // Generate response
    res.status(200).json({
      message: 'Activity Retrieval Successful',
      data: {
        ...activity,
        links: {
          self: `/activities/${activity.id}`,
          report: `/reports`,
        },
      },
      trace_id: req.headers['x-trace-id'],
    });
  } catch (err) {
    next(err);
  }
};

export default getActivityController;
