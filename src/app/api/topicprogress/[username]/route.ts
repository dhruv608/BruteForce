import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getTopicProgressByUsernameService } from '@/lib/server/services/topics/topic-progress.service';
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

    return NextResponse.json({
      success: true,
      student: result.student,
      topics: sortedTopics,
    });
  } catch (err) {
    return handleError(err);
  }
}
