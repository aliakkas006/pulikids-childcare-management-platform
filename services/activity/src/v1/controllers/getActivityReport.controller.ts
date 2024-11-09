import { Response, Request, NextFunction } from 'express';
import activityService from '@/v1/lib/ActivityService';
import CustomError from '@/utils/Error';

const getActivityReportController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: activityId } = req.params;

    // Fetch activity details
    const activity = await activityService.getActivity(activityId);

    if (!activity) {
      const error = CustomError.notFound({
        message: 'Activity not found',
        errors: ['The activity with the provided id does not exist'],
        hints: 'Please provide a valid activity id',
      });
      return next(error);
    }

    // Fetch attendance records for the activity
    const attendanceRecords = await activityService.getAttendanceByActivityId(
      activityId
    );

    const presentCount = attendanceRecords?.filter(
      (record) => record.status === 'present'
    ).length;

    const absentCount = attendanceRecords?.filter(
      (record) => record.status === 'absent'
    ).length;

    // Fetch milestones
    const milestones = await activityService.getMilestonesByActivityId(
      activityId
    );

    // Prepare report data
    const report = {
      activityDetails: {
        name: activity.name,
        date: activity.date,
        type: activity.type,
        location: activity.location,
      },
      attendanceSummary: {
        total: attendanceRecords?.length,
        present: presentCount,
        absent: absentCount,
      },
      milestones: milestones?.map((milestone) => ({
        milestoneId: milestone._id,
        description: milestone.description,
        achieved: milestone.achieved,
      })),
    };

    // Generate response
    const response = {
      message: 'Report generated succssfully',
      data: {
        ...report,
        links: {
          self: req.url,
          attendance: `/activities/${activityId}/attendance`,
          milestone: `/activities/${activityId}/milestone`,
        },
      },
      trace_id: req.headers['x-trace-id'],
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default getActivityReportController;
