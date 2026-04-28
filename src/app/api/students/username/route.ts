import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { updateUsernameSchema } from '@/lib/server/schemas/student.schema';
import { updateUsernameService } from '@/lib/server/services/students/username.service';

export const PATCH = withHandler(
  async ({ user, body }) => {
    const { username } = body as { username: string };
    const updated = await updateUsernameService(user!.id, username);
    return NextResponse.json({ message: 'Username updated successfully', student: updated });
  },
  { requireAuth: true, requireRole: 'student', rateLimit: 'api', bodySchema: updateUsernameSchema }
);
