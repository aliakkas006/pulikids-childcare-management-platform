import { Types } from 'mongoose';

// export enum Role {
//   USER = 'user',
//   ADMIN = 'admin',
// }

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}

export interface IActivity {
  name: string;
  description: string;
  type: string;
  location: string;
  scheduled_date: Date;
  duration: number;
  created_by: string;
}

export interface IAttendance {
  activityId: Types.ObjectId;
  childId: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: AttendanceStatus;
}

export interface IReport {
  activityId: Types.ObjectId;
  summary: string;
  milestones_reached: string;
  attendance_summary: string;
  generated_by: string;
}

export interface IUActivity {
  name: string;
  description: string;
  location: string;
  scheduled_date: Date;
  duration: number;
}

export interface IMilestone {
  activityId: string;
  description: string;
  achieved: boolean;
}

export interface ErrorDetail {
  message: string;
  errors: any[];
  hints: string;
}

export interface CustomErrorInterface extends Error {
  status?: number;
  errors?: any[];
  hints?: string;
}

export type QueryObject = {
  fields?: string;
};

export type ValidationResult = {
  invalidFields: string[];
  validFields: { [key: string]: boolean };
};
