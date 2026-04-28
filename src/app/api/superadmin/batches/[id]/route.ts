import 'server-only';
import { apiOk, apiMessage } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertSuperAdmin } from '@/lib/server/auth-helper';
import { updateBatchService, deleteBatchService } from '@/lib/server/services/batches/batch-crud.service';
import { handleError } from '@/lib/server/error-response';
import { ApiError } from '@/lib/server/utils/ApiError';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertSuperAdmin(user);
    const { id } = await params;
    const batchId = Number(id);
    if (isNaN(batchId)) throw new ApiError(400, 'Invalid batch ID');
    const body = await req.json();
    const updated = await updateBatchService({ id: batchId, ...body });
    return apiOk({ batch: updated }, 'Batch updated successfully');
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    assertSuperAdmin(user);
    const { id } = await params;
    const batchId = Number(id);
    if (isNaN(batchId)) throw new ApiError(400, 'Invalid batch ID');
    await deleteBatchService({ id: batchId });
    return apiMessage('Batch deleted successfully');
  } catch (err) {
    return handleError(err);
  }
}
