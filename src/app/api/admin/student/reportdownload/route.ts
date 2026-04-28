import 'server-only';
import { NextRequest } from 'next/server';
import { getAuthUser, assertAdmin } from '@/lib/server/auth-helper';
import { generateBatchReportCSV } from '@/lib/server/services/admin/csv.service';
import { apiOk } from '@/lib/server/api-response';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);

    const body = await req.json();
    const { batch_id } = body;

    if (!batch_id) throw new ApiError(400, 'batch_id is required');

    const { csvContent, filename } = await generateBatchReportCSV(batch_id);

    return apiOk({ filename, csvContent });
  } catch (err) {
    return handleError(err);
  }
}
