import { Schema, Model, model } from 'mongoose';
import { IActivity } from '@/types';

const activitySchema = new Schema<IActivity>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    scheduled_date: { type: Date, required: true },
    duration: { type: Number, required: true },
    created_by: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Activity: Model<IActivity> = model<IActivity>('Activity', activitySchema);

export default Activity;
