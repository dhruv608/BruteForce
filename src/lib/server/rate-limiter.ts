import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { redisConnection as redis } from '@/lib/server/config/redis';

type LimiterName = 'api' | 'auth' | 'heavy';

const LIMITERS: Record<LimiterName, { windowSec: number; max: number }> = {
  api:   { windowSec: 15 * 60, max: 100 },
  auth:  { windowSec: 15 * 60, max: 50  },
  heavy: { windowSec: 60,       max: 20  },
};

const SLIDING_WINDOW_SCRIPT = `
  local key = KEYS[1]
  local now = tonumber(ARGV[1])
  local windowMs = tonumber(ARGV[2])
  local limit = tonumber(ARGV[3])
  redis.call('ZREMRANGEBYSCORE', key, '-inf', now - windowMs)
  local count = redis.call('ZCARD', key)
  if count < limit then
    redis.call('ZADD', key, now, now .. math.random())
    redis.call('PEXPIRE', key, windowMs)
    return 0
  end
  return 1
`;

export async function applyRateLimit(
  req: NextRequest,
  limiterName: LimiterName
): Promise<NextResponse | null> {
  const config = LIMITERS[limiterName];
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const key = `rl:${limiterName}:${ip}`;
  const now = Date.now();
  const windowMs = config.windowSec * 1000;

  try {
    const result = await (redis as any).eval(
      SLIDING_WINDOW_SCRIPT,
      1,
      key,
      now,
      windowMs,
      config.max
    );

    if (result === 1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests, please try again later',
          code: 'RATE_LIMIT_EXCEEDED',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(config.windowSec) },
        }
      );
    }
  } catch (err) {
    // If Redis is down, allow through (fail open)
    console.error('[RATE_LIMITER] Redis error, failing open:', err);
  }

  return null;
}
