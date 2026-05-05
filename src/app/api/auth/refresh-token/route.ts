import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler, setRefreshTokenCookie } from '@/lib/server/route-handler';
import { getRefreshTokenFromRequest } from '@/lib/server/auth-helper';
import { refreshAccessToken } from '@/lib/server/services/auth/auth-login.service';
import { ApiError } from '@/lib/server/utils/ApiError';

export const POST = withHandler(
  async ({ rawRequest }) => {
    const refreshToken = getRefreshTokenFromRequest(rawRequest);

    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token required', [], 'NO_REFRESH_TOKEN');
    }

    const { accessToken, newRefreshToken } = await refreshAccessToken(refreshToken);

    const response = apiOk({ accessToken });
    setRefreshTokenCookie(response, newRefreshToken);
    return response;
  },
  { rateLimit: 'auth' }
);
