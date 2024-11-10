import { Document, Types } from 'mongoose';

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  FAILED = 'failed',
}

export interface IBooking {
  userId: string;
  providerId: string;
  childName: string;
  serviceType: string;
  bookingDate: Date;
  timeSlot: string;
  isConfirmed: boolean;
}

export interface IProvider {
  name: string;
  email: string;
  capacity: number;
}

export interface IPayment extends Document {
  bookingId: Types.ObjectId;
  amount: number;
  currency?: string;
  status: PaymentStatus;
  transactionId?: string;
  paymentMethod?: string;
  timestamp: Date;
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

export type EmailData = {
  sender?: string;
  recipient: string;
  subject: string;
  body: string;
  source: string;
};

export type EmailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
};

export type EmailResponse = {
  rejected: string[];
};
