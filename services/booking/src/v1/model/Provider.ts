import { IProvider } from '@/types';
import mongoose, { Schema } from 'mongoose';

const ProviderSchema: Schema = new Schema<IProvider>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  capacity: { type: Number, required: true }, // Maximum number of bookings per slot
});

const Provider = mongoose.model<IProvider>('Provider', ProviderSchema);

export default Provider;
