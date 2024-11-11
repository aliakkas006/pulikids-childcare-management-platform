import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import CustomError from '@/utils/Error';
import setCorrelationId from '@/config/setCorrelationId';
import { clerkMiddleware, createClerkClient } from '@clerk/express';
import { apiUrl, publishableKey, secretKey } from '@/config/clerkConfig';
import routesV1 from '@/v1/routes';

const app = express();

// Define the structure of the `auth` object
interface Auth {
  userId?: string;
}

// Extend the Request interface to include the `auth` property
declare module 'express-serve-static-core' {
  interface Request {
    auth?: Auth;
  }
}

app.use([
  express.json(),
  express.urlencoded({ extended: true }),
  setCorrelationId,
  cors(),
  morgan('dev'),
]);

const clerkClient = createClerkClient({
  publishableKey,
  apiUrl,
  secretKey,
});

app.use(clerkMiddleware({ clerkClient }));

// Routes
app.use(routesV1);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ message: '🚀 Booking Service is up and running!' });
});

// Not found handler
app.use((req: Request, res: Response) => {
  const error = CustomError.notFound({
    message: 'Resource Not Found',
    errors: ['The requested resource does not exist'],
    hints: 'Please check the URL and try again',
  });

  res.status(error.status).json({
    ...error,
    status: undefined,
    trace_id: req.headers['x-trace-id'],
  });
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
