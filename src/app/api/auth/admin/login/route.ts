import 'server-only';
import { withHandler, setRefreshTokenCookie } from '@/lib/server/route-handler';
import { loginAdminSchema } from '@/lib/server/schemas/auth.schema';
import { loginAdmin } from '@/lib/server/services/auth/auth-login.service';
import { apiOk } from '@/lib/server/api-response';

export const POST = withHandler(
  async ({ body }) => {
    const { user, accessToken, refreshToken } = await loginAdmin(body as any);
    const response = apiOk({ user, accessToken }, 'Login successful');
    setRefreshTokenCookie(response, refreshToken);
    return response;
  },
  { rateLimit: 'auth', bodySchema: loginAdminSchema }
);
