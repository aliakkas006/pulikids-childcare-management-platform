import { Schema, Model, model } from 'mongoose';
import { IAttendance, AttendanceStatus } from '@/types';

const attendanceSchema = new Schema<IAttendance>({
  activityId: {
    type: Schema.Types.ObjectId,
    ref: 'Activity',
    required: true,
  },
  childId: { type: String, required: true },
  checkInTime: { type: Date},
  checkOutTime: { type: Date},
  status: {
    type: String,
    enum: AttendanceStatus,
    required: true,
    default: AttendanceStatus.ABSENT,
  },
});

const Attendance: Model<IAttendance> = model<IAttendance>(
  'Attendance',
  attendanceSchema
);

export default Attendance;
