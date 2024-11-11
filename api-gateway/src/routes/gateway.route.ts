import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import LoadBalancer from '@/services/loadBalancer';
import cacheMiddleware from '@/middlewares/cache.middleware';

const router = express.Router();

/**
 * Creates a proxy middleware for the specified service with load balancing.
 * @param serviceName - The name of the service.
 * @returns - Proxy middleware for the specified service.
 */
const createServiceProxy = (serviceName: string) => {
  return createProxyMiddleware({
    changeOrigin: true,
    pathRewrite: {
      [`^/${serviceName}`]: '',
    },
    router: (_req) => {
      const instance = LoadBalancer.getNextInstance(serviceName);
      if (!instance) {
        throw new Error(`No available instances for service: ${serviceName}`);
      }

      console.log(
        `Routing to service ${serviceName} at http://${instance.address}:${instance.port}`
      );

      return `http://${instance.address}:${instance.port}`;
    },
  });
};

// Auth Service Routes
router.use('/auth', cacheMiddleware(300), createServiceProxy('auth-service'));

// Activity Service Routes
router.use(
  '/activities',
  cacheMiddleware(300),
  createServiceProxy('activity-service')
);

// Booking Service Routes
router.use(
  '/bookings',
  cacheMiddleware(300),
  createServiceProxy('booking-service')
);

export default router;
