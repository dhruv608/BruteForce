import 'server-only';
import prisma from '@/lib/server/config/prisma';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function resolveBatch(batchSlug: string) {
  if (!batchSlug) {
    throw new ApiError(400, 'Batch slug is required');
  }

  const batch = await prisma.batch.findUnique({
    where: { slug: batchSlug },
    include: { city: true },
  });

  if (!batch) {
    throw new ApiError(404, 'Batch not found', [], 'BATCH_NOT_FOUND');
  }

  return batch;
}
