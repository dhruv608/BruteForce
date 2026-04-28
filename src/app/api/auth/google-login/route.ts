import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { apiOk } from '@/lib/server/api-response';
import { googleAuth } from '@/lib/server/services/auth/auth-login.service';
import { setRefreshTokenCookie } from '@/lib/server/route-handler';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import { applyRateLimit } from '@/lib/server/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const limited = await applyRateLimit(req, 'auth');
    if (limited) return limited;

    const body = await req.json().catch(() => ({}));
    const { idToken } = body as { idToken?: string };

    if (!idToken) {
      throw new ApiError(400, 'ID token is required');
    }

    const { user, accessToken, refreshToken } = await googleAuth(idToken);

    const response = apiOk({ user, accessToken }, 'Google login successful');

    setRefreshTokenCookie(response, refreshToken);
    return response;
  } catch (err) {
    return handleError(err);
  }
}
