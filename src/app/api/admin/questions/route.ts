import 'server-only';
import { NextResponse } from 'next/server';
import { withHandler } from '@/lib/server/route-handler';
import { createQuestionSchema } from '@/lib/server/schemas/question.schema';
import { getAllQuestionsService } from '@/lib/server/services/questions/question-query.service';
import { createQuestionService } from '@/lib/server/services/questions/question-core.service';

export const GET = withHandler(
  async ({ query }) => {
    const result = await getAllQuestionsService({
      topicSlug: query.get('topicSlug') ?? undefined,
      level: query.get('level') ?? undefined,
      platform: query.get('platform') ?? undefined,
      search: query.get('search') ?? undefined,
      page: Number(query.get('page') ?? '1'),
      limit: Number(query.get('limit') ?? '10'),
    });
    return NextResponse.json(result);
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api' }
);

export const POST = withHandler(
  async ({ body }) => {
    const question = await createQuestionService(body as any);
    return NextResponse.json({ message: 'Question created successfully', question }, { status: 201 });
  },
  { requireAuth: true, requireRole: 'teacherOrAbove', rateLimit: 'api', bodySchema: createQuestionSchema }
);
