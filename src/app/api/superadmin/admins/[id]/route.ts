import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, assertSuperAdmin } from '@/lib/server/auth-helper';
import { updateAdminService, deleteAdminService } from '@/lib/server/services/admin/admin-crud.service';
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
    return NextResponse.json({ success: true, message: 'Admin updated successfully', data: updated });
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
    return NextResponse.json({ success: true, message: 'Admin deleted successfully' });
  } catch (err) {
    return handleError(err);
  }
}
