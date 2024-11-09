import { IMilestone } from '@/types';
import mongoose, { Schema } from 'mongoose';

const MilestoneSchema: Schema = new Schema({
  activityId: { type: String, required: true },
  description: { type: String, required: true },
  achieved: { type: Boolean, default: false },
});

export default mongoose.model<IMilestone>('Milestone', MilestoneSchema);
