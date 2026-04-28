import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertStudent } from '@/lib/server/auth-helper';
import { getStudentLeaderboard } from '@/lib/server/services/leaderboard/studentLeaderboard.service';
import { handleError } from '@/lib/server/error-response';
import { applyRateLimit } from '@/lib/server/rate-limiter';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function POST(req: NextRequest) {
  try {
    const limited = await applyRateLimit(req, 'heavy');
    if (limited) return limited;

    const user = getAuthUser(req);
    assertStudent(user);

    if (!user.id || !user.cityId || !user.batchId) {
      throw new ApiError(400, 'Student data not found in JWT.');
    }

    const body = await req.json().catch(() => ({}));

    // Extract batch year from batchName (e.g., "2024-2025" → 2024)
    const batchYear = user.batchName
      ? parseInt(user.batchName.split('-')[0]) || new Date().getFullYear()
      : new Date().getFullYear();

    const jwtData = {
      studentId: user.id,
      cityId: user.cityId,
      batchId: user.batchId,
      batchYear,
    };

    const filters = {
      city: body.city || 'all',
      year: body.year || batchYear,
    };

    const result = await getStudentLeaderboard(jwtData, filters, body.username);

    const formattedTop10 = result.top10.map((entry: any) => ({
      student_id: entry.student_id,
      name: entry.name,
      username: entry.username,
      profile_image_url: entry.profile_image_url,
      batch_year: entry.batch_year,
      city_name: entry.city_name,
      max_streak: entry.max_streak || 0,
      total_solved: Number(entry.total_solved || 0),
      score: Number(entry.score || 0),
      global_rank: entry.global_rank,
      city_rank: entry.city_rank,
    }));

    return NextResponse.json({
      success: true,
      data: {
        top10: formattedTop10,
        yourRank: result.yourRank,
        message: result.message,
        filters: result.filters,
        available_cities: result.available_cities,
        last_calculated: result.last_calculated,
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
