import defaults from '@/config/defaults';
import { IActivity, IMilestone, IUActivity } from '@/types';
import Activity from '@/v1/models/Activity';
import Attendance from '../models/Attendance';
import Milestone from '../models/Milestone';
import CustomError from '@/utils/Error';

class ActivityService {
  /**
   * Creates a new activity with details like name, type, location, and schedule
   * @param activityData - Data for the new activity
   */
  public async createActivity(activityData: IActivity) {
    try {
      const activity: any = new Activity(activityData);
      await activity.save();

      return {
        ...activity._doc,
        id: activity._id,
      };
    } catch (err) {
      console.error('Error Creating Activity: ', err);
      throw err;
    }
  }
  /**
   * Creates a new milestone for the activity
   */
  public async createMilestone(milestoneData: IMilestone) {
    try {
      const milestone: any = new Milestone(milestoneData);
      await milestone.save();

      return {
        ...milestone._doc,
        id: milestone._id,
      };
    } catch (err) {
      console.error('Error Creating Milestone: ', err);
      throw err;
    }
  }

  /**
   * Update an activity with details like name, location, and schedule_date
   * @param id - activity id
   * @param activityData - Data for the activity to be updated
   */
  public async updateActivity(id: string, activityData: IUActivity) {
    try {
      // Update the activity with the provided id and activityData
      const updatedActivity: any = await Activity.findByIdAndUpdate(
        id,
        { $set: activityData },
        { new: true }
      );

      return {
        ...updatedActivity._doc,
        id: updatedActivity._id,
      };
    } catch (err) {
      console.error('Error Updating Activity: ', err);
      throw err;
    }
  }

  /**
   * Delete the activity
   * @param id - activity id
   */
  public async deleteActivity(id: string) {
    try {
      // Delete the activity with the provided id
      const deletedActivity: any = await Activity.findByIdAndDelete(id);

      return {
        ...deletedActivity._doc,
        id: deletedActivity?.id,
      };
    } catch (err) {
      CustomError.throwError({
        name: 'Activity deletion',
        status: 500,
        message: 'The Activity is not deleted',
        errors: ['Activity delete failed'],
        hints:
          'Maybe the activity id is not correct. Please check the activity id and try again',
      });
    }
  }

  /**
   * Retrieves a list of all activities with their details from database
   */
  public async getAllActivity({
    page = defaults.page,
    limit = defaults.limit,
    sortType = defaults.sortType,
    sortBy = defaults.sortBy,
    search = defaults.search,
  }) {
    try {
      const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;
      const filter = {
        name: { $regex: search, $options: 'i' },
      };

      const activities = await Activity.find(filter)
        .sort(sortStr)
        .skip((page - 1) * limit)
        .limit(limit);

      return activities.map((activity: any) => ({
        ...activity._doc,
        id: activity._id,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get Activity By Id
   */
  public async getActivity(id: string) {
    try {
      const activity: any = await Activity.findById(id);

      return {
        ...activity._doc,
        id: activity.id,
      };
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetch attendance records for the activity
   */
  public async getAttendanceByActivityId(activityId: string) {
    try {
      return Attendance.find({ activityId });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Fetch milestones for the activity
   */
  public async getMilestonesByActivityId(activityId: string) {
    try {
      return Milestone.find({ activityId });
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Total Activity count
   */
  public async count({ search = defaults.search }): Promise<number> {
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};

    return Activity.countDocuments(filter);
  }

  /**
   * Track a new attendance
   * @param activityData - Data for the new activity
   */
  public async trackAttendance(attendanceData) {
    try {
      const attendance: any = new Attendance(attendanceData);
      attendance.save();

      return {
        ...attendance._doc,
        id: attendance._id,
      };
    } catch (err) {
      console.error('Error Creating Activity: ', err);
      throw err;
    }
  }
}

const activityService = new ActivityService();
export default activityService;
