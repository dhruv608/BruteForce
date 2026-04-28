import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
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
    return NextResponse.json(topics);
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
    let description: string | undefined;
    let photo: ParsedFile | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      topic_name = formData.get('topic_name') as string;
      description = (formData.get('description') as string) ?? undefined;
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
      description = body.description;
    }

    if (!topic_name) throw new ApiError(400, 'topic_name is required');

    const topic = await createTopicService({ topic_name, description, photo: photo as any });

    await Promise.all([
      CacheInvalidation.invalidateAdminTopics(),
      CacheInvalidation.invalidateTopics(),
      CacheInvalidation.invalidateTopicOverviews(),
    ]);

    return NextResponse.json({ message: 'Topic created successfully', topic }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
