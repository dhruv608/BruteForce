import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { bulkUploadQuestionsService } from '@/lib/server/services/questions/questionBulk.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);

    const formData = await req.formData().catch(() => {
      throw new ApiError(400, 'Invalid multipart form data');
    });

    const fileField = formData.get('file') as File | null;
    if (!fileField) throw new ApiError(400, 'CSV file is required (field name: "file")');

    const topicIdRaw = formData.get('topic_id');
    if (!topicIdRaw) throw new ApiError(400, 'topic_id is required');
    const topic_id = Number(topicIdRaw);
    if (isNaN(topic_id) || topic_id <= 0) throw new ApiError(400, 'Invalid topic_id');

    const buffer = Buffer.from(await fileField.arrayBuffer());
    const result = await bulkUploadQuestionsService(buffer, topic_id);

    return NextResponse.json({ message: 'Bulk upload successful', ...result });
  } catch (err) {
    return handleError(err);
  }
}
