import 'server-only';
import { withHandler, setRefreshTokenCookie } from '@/lib/server/route-handler';
import { loginStudentSchema, type LoginStudentInput } from '@/lib/server/schemas/auth.schema';
import { loginStudent } from '@/lib/server/services/auth/auth-login.service';
import { apiOk } from '@/lib/server/api-response';

export const POST = withHandler(
  async ({ body }) => {
    const { user, accessToken, refreshToken } = await loginStudent(body as LoginStudentInput);
    const response = apiOk({ user, accessToken }, 'Login successful');
    setRefreshTokenCookie(response, refreshToken);
    return response;
  },
  { rateLimit: 'auth', bodySchema: loginStudentSchema }
);
