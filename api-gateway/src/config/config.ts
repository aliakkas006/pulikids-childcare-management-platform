import { ServiceInfo } from '@/types';

// Auth Service information for registration in Consul
export const authServiceInfo: Omit<ServiceInfo, 'status'> = {
  id: 'auth-service',
  name: 'auth-service',
  address: 'localhost',
  port: 4003,
  tags: ['auth'],
};

// Activity Service information for registration in Consul
export const activityServiceInfo: Omit<ServiceInfo, 'status'> = {
  id: 'activity-service',
  name: 'activity-service',
  address: 'localhost',
  port: 4000,
  tags: ['activity'],
};

// Booking Service information for registration in Consul
export const bookingServiceInfo: Omit<ServiceInfo, 'status'> = {
  id: 'booking-service',
  name: 'booking-service',
  address: 'localhost',
  port: 4001,
  tags: ['activity'],
};
