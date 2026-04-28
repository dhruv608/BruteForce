import 'server-only';
import { apiOk, apiCreated } from '@/lib/server/api-response';
import { withHandler } from '@/lib/server/route-handler';
import { bookmarkQuerySchema, createBookmarkSchema } from '@/lib/server/schemas/bookmark.schema';
import { getBookmarksService } from '@/lib/server/services/bookmarks/bookmark-query.service';
import { addBookmarkService } from '@/lib/server/services/bookmarks/bookmark-crud.service';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';

export const GET = withHandler(
  async ({ user, query }) => {
    const page = Number(query.get('page') ?? '1');
    const limit = Number(query.get('limit') ?? '10');
    const sort = (query.get('sort') ?? 'recent') as 'recent' | 'old' | 'solved' | 'unsolved';
    const filter = (query.get('filter') ?? 'all') as 'all' | 'solved' | 'unsolved';

    const result = await getBookmarksService(user!.id, { page, limit, sort, filter });
    return apiOk(result);
  },
  { requireAuth: true, requireRole: 'student', rateLimit: 'api' }
);

export const POST = withHandler(
  async ({ user, body }) => {
    const { question_id, description } = body as { question_id: number; description?: string };
    const bookmark = await addBookmarkService(user!.id, question_id, description);

    await Promise.all([
      CacheInvalidation.invalidateBookmarksForStudent(user!.id),
      CacheInvalidation.invalidateAssignedQuestionsForStudent(user!.id),
      CacheInvalidation.invalidateClassProgressForStudent(user!.id),
    ]);

    return apiCreated(bookmark, 'Bookmark added successfully');
  },
  { requireAuth: true, requireRole: 'student', rateLimit: 'api', bodySchema: createBookmarkSchema }
);
