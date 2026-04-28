import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { parseFormDataFileAny } from '@/lib/server/file-helper';
import { publicBulkStudentUploadService } from '@/lib/server/services/bulk.service';
import { resolveBatch } from '@/lib/server/batch-helper';
import { handleError } from '@/lib/server/error-response';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchSlug: string }> }
) {
  try {
    const { batchSlug } = await params;
    const batch = await resolveBatch(batchSlug);

    const file = await parseFormDataFileAny(req, 'csv');

    const result = await publicBulkStudentUploadService(file.buffer, {
      batch_id: batch.id,
      city_id: batch.city_id,
    });

    return NextResponse.json(
      {
        message: 'Students upload successful',
        ...(typeof result === 'object' && result !== null ? result : {}),
      },
      { status: 201 }
    );
  } catch (err) {
    return handleError(err);
  }
}
