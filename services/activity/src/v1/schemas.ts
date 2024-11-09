import { z } from 'zod';

/**
 * Activity create schema
 * Zod's preprocess method to convert the incoming string to a Date object before validation.
 */
export const ActivityCreateSchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string(),
  type: z.string(),
  location: z.string(),
  scheduled_date: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date()),
  duration: z.number().int(),
  created_by: z.string(),
});

export const ActivityUpdateSchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string(),
  location: z.string(),
  scheduled_date: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date()),
  duration: z.number().int(),
});

export const TrackAttendanceSchema = z.object({
  activityId: z.string(),
  childId: z.string(),
  check_in: z
    .preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
      }
      return arg;
    }, z.date())
    .optional(),
  check_out: z
    .preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
      }
      return arg;
    }, z.date())
    .optional(),
  status: z.enum(['present', 'absent']),
});

export const MilestoneCreateSchema = z.object({
  activityId: z.string(),
  description: z.string(),
  achieved: z.boolean().optional().default(false),
});
