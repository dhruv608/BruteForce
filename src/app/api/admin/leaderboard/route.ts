import 'server-only';
import { NextRequest } from 'next/server';
import { getAuthUser, assertAdmin } from '@/lib/server/auth-helper';
import { getAdminLeaderboard } from '@/lib/server/services/leaderboard/adminLeaderboard.service';
import { apiOk } from '@/lib/server/api-response';
import { handleError } from '@/lib/server/error-response';
import { applyRateLimit } from '@/lib/server/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    const limited = await applyRateLimit(req, 'heavy');
    if (limited) return limited;

    const user = getAuthUser(req);
    assertAdmin(user);

    const body = await req.json().catch(() => ({}));
    const sp = new URL(req.url).searchParams;

    const filters = {
      city: body.city || 'all',
      year: body.year || new Date().getFullYear(),
    };

    const pagination = {
      page: Number(sp.get('page') ?? body.page ?? 1),
      limit: Number(sp.get('limit') ?? body.limit ?? 10),
    };

    const search = (sp.get('search') ?? body.search) as string | undefined;

    const result = await getAdminLeaderboard(filters, pagination, search);

    const formattedLeaderboard = result.leaderboard.map((entry: any) => ({
      student_id: entry.student_id,
      name: entry.name,
      username: entry.username,
      batch_year: entry.batch_year,
      city_name: entry.city_name,
      profile_image_url: entry.profile_image_url || null,
      max_streak: entry.max_streak || 0,
      total_solved: Number(entry.total_solved || 0),
      score: Number(entry.score || 0),
      global_rank: entry.global_rank,
      city_rank: entry.city_rank,
    }));

    return apiOk({
      leaderboard: formattedLeaderboard,
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      available_cities: result.available_cities,
      last_calculated: result.last_calculated,
    });
  } catch (err) {
    return handleError(err);
  }
}
