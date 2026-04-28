import 'server-only';
import Redis, { RedisOptions } from 'ioredis';

const USE_CLOUD_REDIS = process.env.USE_CLOUD_REDIS === 'true';
const CLOUD_REDIS_URL = process.env.CLOUD_REDIS_URL ?? '';

const redisUrl = USE_CLOUD_REDIS && CLOUD_REDIS_URL ? CLOUD_REDIS_URL : 'redis://localhost:6379';
const connectionType = USE_CLOUD_REDIS && CLOUD_REDIS_URL ? 'CLOUD' : 'LOCAL';

const redisOptions: RedisOptions = {
  // Required by BullMQ — workers reuse this connection
  maxRetriesPerRequest: null,
  // Don't connect until first command — prevents startup failure if Redis is down
  lazyConnect: true,
  // Exponential backoff on reconnect: 50ms, 100ms, ..., capped at 2s
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
  // Reconnect on READONLY errors (Redis Cluster failover)
  reconnectOnError: (err: Error) => err.message.includes('READONLY'),
  // Quick failover on commands when disconnected
  enableOfflineQueue: true,
};

declare global {
  var redisGlobal: Redis | undefined;
}

const createRedisClient = () => {
  const client = new Redis(redisUrl, redisOptions);

  client.on('connect', () => {
    console.log(`[REDIS] Connected to ${connectionType} (${redisUrl.replace(/\/\/.*@/, '//***@')})`);
  });

  client.on('error', (err: Error) => {
    // Suppress noisy ECONNREFUSED logs in dev — keep one warning
    if ((err as any).code === 'ECONNREFUSED' && process.env.NODE_ENV !== 'production') {
      if (!(client as any).__loggedECONN) {
        console.warn(`[REDIS] Cannot reach ${connectionType} Redis — caching disabled until reconnect`);
        (client as any).__loggedECONN = true;
      }
      return;
    }
    console.error('[REDIS] Connection error:', err.message);
  });

  client.on('ready', () => {
    (client as any).__loggedECONN = false;
  });

  client.on('close', () => {
    console.log('[REDIS] Connection closed');
  });

  return client;
};

// Singleton across hot reloads in dev — prevents connection leaks
export const redisConnection: Redis = globalThis.redisGlobal ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.redisGlobal = redisConnection;
}

/**
 * Safe wrapper that swallows Redis errors and logs them.
 * Use for cache reads/writes where failure should fall through to DB.
 */
export async function safeRedis<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    console.warn('[REDIS] Operation failed (failing open):', (err as Error).message);
    return fallback;
  }
}

export default redisConnection;
