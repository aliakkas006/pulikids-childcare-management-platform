import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import gatewayRoutes from '@/routes/gateway.route';
import serviceRegistry from '@/services/serviceRegistry';
import {
  activityServiceInfo,
  authServiceInfo,
  bookingServiceInfo,
} from './config/config';

const app = express();

app.use([
  express.json(),
  express.urlencoded({ extended: true }),
  helmet(),
  cors(),
  morgan('dev'),
]);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

(async () => {
  try {
    // Register auth-service with Consul
    await serviceRegistry.registerService(authServiceInfo);

    // Register booking-service with Consul
    await serviceRegistry.registerService(activityServiceInfo);

    // Register auth-service with Consul
    await serviceRegistry.registerService(bookingServiceInfo);
  } catch (error) {
    console.error('Error registering service with Consul:', error);
  }
})();

// Routes
app.use('/api/v1', gatewayRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ message: '🚀 API Gateway is up and running!' });
});

// Global error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const errObj = {
    status: err?.status || 500,
    message: err?.message || 'Something went wrong!',
    errors: err?.errors || [],
    correlationId: req.headers['x-trace-id'],
  };

  console.error(JSON.stringify(errObj));
  res.status(errObj.status).json(errObj);
});

export default app;
