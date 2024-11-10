import { IBooking, PaymentStatus } from '@/types';
import { Schema, model } from 'mongoose';

const BookingSchema: Schema = new Schema<IBooking>(
  {
    userId: { type: String, required: true },
    providerId: { type: String, required: true },
    childName: { type: String, required: true },
    serviceType: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Booking = model<IBooking>('Booking', BookingSchema);

export default Booking;
