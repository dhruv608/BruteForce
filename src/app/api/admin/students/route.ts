import 'server-only';
import { apiOk, apiCreated } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { createStudentSchema, studentQuerySchema, type CreateStudentInput } from '@/lib/server/schemas/student.schema';
import { getAllStudentsService } from '@/lib/server/services/students/student-query.service';
import { createStudentService } from '@/lib/server/services/students/student.service';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';

export const GET = withHandler(
  async ({ query }) => {
    const result = await getAllStudentsService(Object.fromEntries(query.entries()));
    return apiOk(result);
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api' }
);

export const POST = withHandler(
  async ({ body }) => {
    const student = await createStudentService(body as CreateStudentInput);
    if (student?.id) await CacheInvalidation.invalidateStudent(student.id, student.batch_id ?? undefined);
    await CacheInvalidation.invalidateAllLeaderboards();
    return apiCreated(student, 'Student created successfully');
  },
  { requireAuth: true, requireRole: 'teacherOrAbove', rateLimit: 'api', bodySchema: createStudentSchema }
);
