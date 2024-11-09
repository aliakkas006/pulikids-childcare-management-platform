import { Response, Request, NextFunction } from 'express';
import activityService from '@/v1/lib/ActivityService';
import defaults from '@/config/defaults';
import { getPagination, getTransformedItems } from '@/utils/query';

const getAllActivitiesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query;

    // Extract query params
    const page: number = parseInt(query.page as string) || defaults.page;
    const limit: number = parseInt(query.limit as string) || defaults.limit;
    const sortType: string = (query.sort_type as string) || defaults.sortType;
    const sortBy: string = (query.sort_by as string) || defaults.sortBy;
    const search: string = (query.search as string) || defaults.search;

    // Get all activities based on filtering
    const items: any = await activityService.getAllActivity({
      page,
      limit,
      sortType,
      sortBy,
      search,
    });

    const data = getTransformedItems({
      items,
      selection: [
        'id',
        'name',
        'description',
        'type',
        'location',
        'scheduled_date',
      ],
    });

    const totalItems = await activityService.count({ search });

    const activities = data.map((item) => {
      return {
        ...item,
        links: {
          self: `/activities/${item.id}`,
          report: `/reports`,
        },
      };
    });

    // Prepare response
    const response = {
      message: 'Activities fetched successfully',
      data: activities,
      pagination: getPagination({ totalItems, limit, page }),
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export default getAllActivitiesController;
