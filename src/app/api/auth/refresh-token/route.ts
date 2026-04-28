import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getRefreshTokenFromRequest } from '@/lib/server/auth-helper';
import { refreshAccessToken } from '@/lib/server/services/auth/auth-login.service';
import { setRefreshTokenCookie } from '@/lib/server/route-handler';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = getRefreshTokenFromRequest(req);

    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token required', [], 'NO_REFRESH_TOKEN');
    }

    const { accessToken, newRefreshToken } = await refreshAccessToken(refreshToken);

    const response = NextResponse.json({ accessToken });
    setRefreshTokenCookie(response, newRefreshToken);
    return response;
  } catch (err) {
    return handleError(err);
  }
}
