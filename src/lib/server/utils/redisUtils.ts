import 'server-only';
import redis from '@/lib/server/config/redis';

/**
 * Non-blocking SCAN-based pattern deletion.
 * Falls open on Redis errors — caching failure must never block writes.
 */
export async function deleteByPattern(pattern: string): Promise<void> {
  try {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch (err) {
    console.warn(`[REDIS] deleteByPattern("${pattern}") failed:`, (err as Error).message);
  }
}

/**
 * Stable deterministic cache key generation.
 * Note: Always appends `:` after base so invalidation patterns like `${base}:*` match.
 */
export function buildCacheKey(base: string, params: Record<string, any>): string {
  const serialized = Object.entries(params || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');

  return `${base}:${serialized}`;
}

/**
 * SET with TTL — fails open on Redis errors.
 */
export async function setWithTTL(key: string, value: string, ttlSeconds: number): Promise<void> {
  try {
    await redis.set(key, value, 'EX', ttlSeconds);
  } catch (err) {
    console.warn(`[REDIS] setWithTTL("${key}") failed:`, (err as Error).message);
  }
}

/**
 * Raw GET — fails open on Redis errors, returns null on connection failure.
 * Drop-in replacement for `redis.get(key)` for cache reads in services.
 */
export async function safeGet(key: string): Promise<string | null> {
  try {
    return await redis.get(key);
  } catch (err) {
    console.warn(`[REDIS] safeGet("${key}") failed:`, (err as Error).message);
    return null;
  }
}

/**
 * GET with JSON parsing — fails open on Redis errors, returns null on miss/error.
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[REDIS] getCached("${key}") failed:`, (err as Error).message);
    return null;
  }
}

/**
 * Atomic delete of multiple specific keys — fails open.
 */
export async function delKeys(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch (err) {
    console.warn('[REDIS] delKeys failed:', (err as Error).message);
  }
}
