import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { updateProfileSchema } from '@/lib/server/schemas/student.schema';
import { getCurrentStudentService } from '@/lib/server/services/students/student.service';
import { updateStudentProfileData } from '@/lib/server/services/students/profile.service';
import { formatStudentResponse } from '@/lib/server/services/students/student-response.service';

export const GET = withHandler(
  async ({ user }) => {
    const student = await getCurrentStudentService(user!.id);
    return NextResponse.json(formatStudentResponse(student as any));
  },
  { requireAuth: true, requireRole: 'student', rateLimit: 'api' }
);

export const PUT = withHandler(
  async ({ user, body }) => {
    const data = body as any;
    const updated = await updateStudentProfileData(user!.id, data);
    return apiOk({ student: updated }, 'Profile updated successfully');
  },
  { requireAuth: true, requireRole: 'student', rateLimit: 'api', bodySchema: updateProfileSchema }
);
