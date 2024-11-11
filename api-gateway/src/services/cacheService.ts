import { Redis } from 'ioredis';

/**
 * CacheService is responsible for providing a simple interface to interact with a Redis cache.
 * It supports basic operations like setting, getting, deleting, and clearing cache entries.
 * This is useful for reducing load on services by caching frequent read-only requests.
 */
class CacheService {
  private redis: Redis;

  constructor() {
    // Initialize the Redis client
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryStrategy: (times) => {
        return Math.min(times * 50, 2000); // Retry strategy with incremental backoff up to a maximum of 2000 ms
      },
    });

    this.init();
  }

  /**
   * Initializes event listeners for Redis connection and error events.
   * Logs errors and connection status to the console for monitoring purposes.
   */
  private init() {
    // Log an error message if there's an issue with the Redis connection
    this.redis.on('error', (error) => {
      console.error('Redis error:', error);
    });

    // Log a success message when successfully connected to Redis
    this.redis.on('connect', () => {
      console.log('Connected to Redis!');
    });
  }

  /**
   * Retrieves the value of a specified cache entry.
   * @param key - The key of the cache entry to retrieve
   * @returns The value of the cache entry or null if not found or on error
   */
  public async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  /**
   * Sets a cache entry with an optional expiration time.
   * @param key - The key of the cache entry
   * @param value - The value to store in the cache
   * @param expirationInSeconds - Optional expiration time in seconds
   */
  public async set(
    key: string,
    value: string,
    expirationInSeconds?: number
  ): Promise<void> {
    try {
      if (expirationInSeconds) {
        await this.redis.set(key, value, 'EX', expirationInSeconds);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  /**
   * Deletes a specific cache entry by its key.
   * @param key - The key of the cache entry to delete
   */
  public async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Error deleting cache:', error);
    }
  }

  /**
   * Clears all cache entries in Redis.
   */
  public async clear(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export default new CacheService();
