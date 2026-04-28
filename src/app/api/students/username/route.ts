import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { updateUsernameSchema } from '@/lib/server/schemas/student.schema';
import { updateUsernameService } from '@/lib/server/services/students/username.service';

export const PATCH = withHandler(
  async ({ user, body }) => {
    const { username } = body as { username: string };
    const updated = await updateUsernameService(user!.id, username);
    return apiOk({ student: updated }, 'Username updated successfully');
  },
  { requireAuth: true, requireRole: 'student', rateLimit: 'api', bodySchema: updateUsernameSchema }
);
