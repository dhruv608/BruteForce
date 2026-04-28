import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { forgotPasswordSchema } from '@/lib/server/schemas/auth.schema';
import { sendPasswordResetOTP } from '@/lib/server/services/auth/auth-password.service';

export const POST = withHandler(
  async ({ body }) => {
    const { email } = body as { email: string };
    const result = await sendPasswordResetOTP(email);

    return apiOk(result);
  },
  { bodySchema: forgotPasswordSchema }
);
