import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { createStudentSchema, studentQuerySchema } from '@/lib/server/schemas/student.schema';
import { getAllStudentsService } from '@/lib/server/services/students/student-query.service';
import { createStudentService } from '@/lib/server/services/students/student.service';

export const GET = withHandler(
  async ({ query }) => {
    const result = await getAllStudentsService(Object.fromEntries(query.entries()));
    return NextResponse.json(result);
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api' }
);

export const POST = withHandler(
  async ({ body }) => {
    const student = await createStudentService(body as any);
    return NextResponse.json({ message: 'Student created successfully', data: student }, { status: 201 });
  },
  { requireAuth: true, requireRole: 'teacherOrAbove', rateLimit: 'api', bodySchema: createStudentSchema }
);
