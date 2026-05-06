import 'server-only';
import { apiOk, apiCreated } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { createQuestionSchema } from '@/lib/server/schemas/question.schema';
import { getAllQuestionsService } from '@/lib/server/services/questions/question-query.service';
import { createQuestionService } from '@/lib/server/services/questions/question-core.service';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';

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
    return apiOk(result);
  },
  { requireAuth: true, requireRole: 'admin', rateLimit: 'api' }
);

export const POST = withHandler(
  async ({ body }) => {
    const question = await createQuestionService(body as any);
    await Promise.all([
      CacheInvalidation.invalidateAssignedQuestions(),
      CacheInvalidation.invalidateTopics(),
      CacheInvalidation.invalidateTopicOverviews(),
    ]);
    return apiCreated({ question }, 'Question created successfully');
  },
  { requireAuth: true, requireRole: 'teacherOrAbove', rateLimit: 'api', bodySchema: createQuestionSchema }
);
