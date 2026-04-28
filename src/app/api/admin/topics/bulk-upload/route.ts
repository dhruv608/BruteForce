import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { parseFormDataFileAny } from '@/lib/server/file-helper';
import { handleError } from '@/lib/server/error-response';
import prisma from '@/lib/server/config/prisma';
import { createTopicService } from '@/lib/server/services/topics/topic.service';
import { CacheInvalidation } from '@/lib/server/utils/cacheInvalidation';
import { Readable } from 'stream';
import csv from 'csv-parser';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);

    const file = await parseFormDataFileAny(req, 'csv');

    const rows: any[] = await new Promise((resolve, reject) => {
      const result: any[] = [];
      Readable.from(file.buffer)
        .pipe(csv())
        .on('data', (d: any) => result.push(d))
        .on('end', () => resolve(result))
        .on('error', reject);
    });

    const created = [];
    const errors = [];

    for (const row of rows) {
      try {
        if (!row.topic_name) { errors.push({ topic: row.topic_name, issue: 'Missing topic_name' }); continue; }
        const topic = await createTopicService({ topic_name: row.topic_name.trim() });
        created.push(topic);
      } catch (err: any) {
        errors.push({ topic: row.topic_name, issue: err.message });
      }
    }

    if (created.length > 0) {
      await Promise.all([
        CacheInvalidation.invalidateAdminTopics(),
        CacheInvalidation.invalidateTopics(),
        CacheInvalidation.invalidateTopicOverviews(),
      ]);
    }

    return NextResponse.json({ created: created.length, errors });
  } catch (err) {
    return handleError(err);
  }
}
