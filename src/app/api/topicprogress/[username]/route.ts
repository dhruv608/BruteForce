import 'server-only';
import { NextRequest } from 'next/server';
import { getTopicProgressByUsernameService } from '@/lib/server/services/topics/topic-progress.service';
import { apiOk } from '@/lib/server/api-response';
import { handleError } from '@/lib/server/error-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const sortBy = new URL(req.url).searchParams.get('sortBy') ?? 'solved';

    const result = await getTopicProgressByUsernameService(username);

    let sortedTopics = result.topics;
    if (sortBy === 'solved') {
      sortedTopics.sort((a: any, b: any) => b.solvedQuestions - a.solvedQuestions);
    } else if (sortBy === 'progress') {
      sortedTopics.sort((a: any, b: any) => b.progressPercentage - a.progressPercentage);
    }

    return apiOk({ student: result.student, topics: sortedTopics });
  } catch (err) {
    return handleError(err);
  }
}
