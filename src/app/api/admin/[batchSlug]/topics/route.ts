import 'server-only';
import { apiOk } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertAdmin } from '@/lib/server/auth-helper';
import { resolveBatch } from '@/lib/server/batch-helper';
import { getTopicsForBatchService } from '@/lib/server/services/topics/topic-query.service';
import { handleError } from '@/lib/server/error-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    const { batchSlug } = await params;
    const batch = await resolveBatch(batchSlug);
    const query = Object.fromEntries(new URL(req.url).searchParams.entries());
    const data = await getTopicsForBatchService({ batchId: batch.id, query });
    return apiOk(data);
  } catch (err) {
    return handleError(err);
  }
}
