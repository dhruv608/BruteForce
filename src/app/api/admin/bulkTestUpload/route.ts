import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertAdmin, assertTeacherOrAbove } from '@/lib/server/auth-helper';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';
import prisma from '@/lib/server/config/prisma';
import { createQuestionService } from '@/lib/server/services/questions/question-core.service';
import { Readable } from 'stream';
import csv from 'csv-parser';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);
    assertTeacherOrAbove(user);

    const formData = await req.formData().catch(() => { throw new ApiError(400, 'Invalid form data'); });
    const fileField = formData.get('file') as File | null;
    if (!fileField) throw new ApiError(400, 'CSV file is required (field name: "file")');

    const buffer = Buffer.from(await fileField.arrayBuffer());

    const results: any[] = await new Promise((resolve, reject) => {
      const rows: any[] = [];
      Readable.from(buffer)
        .pipe(csv())
        .on('data', (d: any) => rows.push(d))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });

    if (!results.length) throw new ApiError(400, 'CSV file is empty');

    const created = [];
    const errors = [];

    for (const row of results) {
      try {
        const topic = await prisma.topic.findFirst({ where: { slug: row.topic_slug?.trim() } });
        if (!topic) { errors.push({ row: row.question_name, issue: `Topic not found: ${row.topic_slug}` }); continue; }

        const question = await createQuestionService({
          question_name: row.question_name?.trim(),
          question_link: row.question_link?.trim(),
          level: (row.level?.trim()?.toUpperCase() || 'EASY') as 'EASY' | 'MEDIUM' | 'HARD',
          topic_id: topic.id,
          platform: (row.platform?.trim()?.toUpperCase() || 'LEETCODE') as 'LEETCODE' | 'GFG' | 'OTHER',
        });
        created.push(question);
      } catch (err: any) {
        errors.push({ row: row.question_name, issue: err.message });
      }
    }

    return NextResponse.json({ success: true, created: created.length, errors });
  } catch (err) {
    return handleError(err);
  }
}
