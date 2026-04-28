import 'server-only';
import { NextRequest } from 'next/server';
import { getAuthUser, assertSuperAdmin } from '@/lib/server/auth-helper';
import { updateAdminService, deleteAdminService } from '@/lib/server/services/admin/admin-crud.service';
import { apiOk, apiMessage } from '@/lib/server/api-response';
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
    const adminId = Number(id);
    if (isNaN(adminId)) throw new ApiError(400, 'Invalid admin ID');
    const body = await req.json();
    const updated = await updateAdminService(adminId, body);
    return apiOk(updated, 'Admin updated successfully');
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
    const adminId = Number(id);
    if (isNaN(adminId)) throw new ApiError(400, 'Invalid admin ID');
    await deleteAdminService(adminId);
    return apiMessage('Admin deleted successfully');
  } catch (err) {
    return handleError(err);
  }
}
