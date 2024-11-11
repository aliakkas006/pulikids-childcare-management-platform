import { Request, Response, NextFunction } from 'express';
import CacheService from '@/services/cacheService';

/**
 * Middleware function to cache responses for GET requests.
 * - Uses Redis to cache responses, reducing load on backend services.
 * - Only applies to GET requests.
 * @param ttl - Time-to-live in seconds for cache entries (default is 300 seconds).
 */
const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    // Generate a unique cache key using the request's original URL
    const key = `cache:${req.originalUrl}`;

    try {
      const cachedResponse = await CacheService.get(key);

      if (cachedResponse) {
        res.json(JSON.parse(cachedResponse));
        return;
      }

      const originalJson = res.json;

      /**
       * Override the res.json method to cache the response.
       * - When res.json is called, it saves the response to Redis before sending.
       */
      res.json = function (body) {
        CacheService.set(key, JSON.stringify(body), ttl);
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default cacheMiddleware;
