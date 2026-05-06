import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertAdmin } from '@/lib/server/auth-helper';
import { bulkStudentUploadService } from '@/lib/server/services/bulk.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);

    const formData = await req.formData().catch(() => {
      throw new ApiError(400, 'Invalid multipart form data');
    });

    const batch_id = formData.get('batch_id');
    if (!batch_id) throw new ApiError(400, 'batch_id is required');

    const fileField = formData.get('file') as File | null;
    if (!fileField) throw new ApiError(400, 'CSV file is required (field name: "file")');

    const buffer = Buffer.from(await fileField.arrayBuffer());

    const result = await bulkStudentUploadService(buffer, { batch_id: Number(batch_id) });
    await CacheInvalidation.invalidateBatch(Number(batch_id));
    await CacheInvalidation.invalidateAllLeaderboards();
    return NextResponse.json(
      { message: 'Students upload successful', ...(typeof result === 'object' && result ? result : {}) },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
