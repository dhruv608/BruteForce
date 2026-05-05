import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import prisma from '@/lib/server/config/prisma';
import { s3Client, S3_BUCKET_NAME } from '@/lib/server/config/s3.config';
import { getAuthUser, assertAdmin } from '@/lib/server/auth-helper';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

/**
 * GET /api/admin/topics/[topicSlug]/photo
 * Server-side proxy that streams the topic's S3 photo to the client.
 * Used by the admin EditTopicModal to fetch the existing image as a Blob
 * (without requiring S3 CORS to be configured for the browser origin).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ topicSlug: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertAdmin(user);

    const { topicSlug } = await params;

    const topic = await prisma.topic.findUnique({
      where: { slug: topicSlug },
      select: { photo_url: true },
    });

    if (!topic?.photo_url) {
      throw new ApiError(404, 'Topic photo not found');
    }

    // Extract S3 key from the stored URL: https://{bucket}.s3.{region}.amazonaws.com/topics/{file}
    const url = new URL(topic.photo_url);
    const key = url.pathname.replace(/^\//, '');

    const s3Response = await s3Client.send(
      new GetObjectCommand({ Bucket: S3_BUCKET_NAME, Key: key })
    );

    if (!s3Response.Body) {
      throw new ApiError(500, 'S3 returned empty body');
    }

    // Convert AWS SDK's Readable stream into a web ReadableStream
    const nodeStream = s3Response.Body as Readable;
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
    });

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': s3Response.ContentType ?? 'image/jpeg',
        'Cache-Control': 'private, no-cache',
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
