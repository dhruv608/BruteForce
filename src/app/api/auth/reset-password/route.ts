import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { resetPasswordSchema } from '@/lib/server/schemas/auth.schema';
import { resetPassword } from '@/lib/server/services/auth/auth-password.service';

export const POST = withHandler(
  async ({ body }) => {
    const { email, otp, newPassword } = body as { email: string; otp: string; newPassword: string };
    const result = await resetPassword(email, otp, newPassword);

    return apiOk(result);
  },
  { bodySchema: resetPasswordSchema }
);
