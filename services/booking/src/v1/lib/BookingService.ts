import { IBooking, IProvider } from '@/types';
import Provider from '@/v1/model/Provider';
import Booking from '@/v1/model/Booking';

class BookingService {
  /**
   * Create a new booking
   * @param bookingData - Data for the new booking
   */
  public async createBooking(bookingData) {
    try {
      const booking: any = new Booking(bookingData);
      await booking.save();

      return {
        ...booking._doc,
        id: booking._id,
      };
    } catch (err) {
      console.error('Error Creating Booking', err);
    }
  }

  /**
   * Availability Checking (Configurable by date, time, and provider capacity).
   */
  public async checkAvailability(
    providerId: string,
    date: Date,
    timeSlot: string
  ) {
    try {
      // Find the provider's maximum capacity
      const provider = await Provider.findById(providerId);
      if (!provider) throw new Error('Provider not found');

      // Count existing bookings for the same date, time slot, and provider
      const bookingCount = await Booking.countDocuments({
        providerId,
        bookingDate: date,
        timeSlot,
      });

      // Check if the number of bookings is less than provider capacity
      return bookingCount < provider.capacity;
    } catch (err) {
      console.error('Error Checking Availability', err);
    }
  }

  /**
   * Create a new provider
   * @param providerData - Data for the new provider
   */
  public async createProvider(providerData: IProvider) {
    try {
      const provider: any = new Provider(providerData);
      await provider.save();

      return {
        ...provider._doc,
        id: provider._id,
      };
    } catch (err) {
      console.error('Error Creating Provider: ', err);
    }
  }

  /**
   * Get Booking by Id
   */
  public async getBooking(id: string) {
    try {
      return Booking.findById(id);

      // return {
      //   ...booking._doc,
      //   id: booking.id,
      // };
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get Childcare Provider by Id
   */
  public async getProvider(id: string) {
    try {
      const provider: any = await Provider.findById(id);

      return {
        ...provider._doc,
        id: provider.id,
      };
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Find Childcare Provider by email
   */
  public async getProviderByEmail(email: string) {
    try {
      const provider: any = await Provider.findOne({ email });

      return {
        ...provider._doc,
        id: provider.id,
      };
    } catch (err) {
      console.error(err);
    }
  }
}

const bookingService = new BookingService();
export default bookingService;
