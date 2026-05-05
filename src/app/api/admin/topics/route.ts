import 'server-only';
import { apiOk, apiCreated } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { getAllTopicsService } from '@/lib/server/services/topics/topic-query.service';
import { createTopicService } from '@/lib/server/services/topics/topic.service';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import type { ParsedFile } from '@/lib/server/file-helper';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    const topics = await getAllTopicsService();
    return apiOk(topics);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);

    const contentType = req.headers.get('content-type') ?? '';
    let topic_name: string;
    let photo: ParsedFile | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      topic_name = formData.get('topic_name') as string;
      const photoFile = formData.get('photo') as File | null;
      if (photoFile) {
        const buf = await photoFile.arrayBuffer();
        photo = {
          buffer: Buffer.from(buf),
          originalname: photoFile.name,
          mimetype: photoFile.type,
          size: photoFile.size,
        };
      }
    } else {
      const body = await req.json();
      topic_name = body.topic_name;
    }

    if (!topic_name) throw new ApiError(400, 'topic_name is required');

    const topic = await createTopicService({ topic_name, photo: photo as any });

    await Promise.all([
      CacheInvalidation.invalidateAdminTopics(),
      CacheInvalidation.invalidateTopics(),
      CacheInvalidation.invalidateTopicOverviews(),
    ]);

    return apiCreated({ topic }, 'Topic created successfully');
  } catch (err) {
    return handleError(err);
  }
}
