import { IPayment, PaymentStatus } from '@/types';
import { Schema, model } from 'mongoose';

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
        type: String,
        default: 'usd'
    },
    status: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
      required: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model using the schema
const Payment = model<IPayment>('Payment', PaymentSchema);

export default Payment;
