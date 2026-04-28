import 'server-only';
import { apiOk, apiMessage } from '@/lib/server/api-response';
import { NextRequest } from 'next/server';
import { getAuthUser, assertSuperAdmin } from '@/lib/server/auth-helper';
import { updateCityService, deleteCityService } from '@/lib/server/services/cities/city.service';
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
    const cityId = Number(id);
    if (isNaN(cityId)) throw new ApiError(400, 'Invalid city ID');
    const body = await req.json();
    const updated = await updateCityService({ id: cityId, city_name: body.city_name });
    return apiOk({ city: updated }, 'City updated successfully');
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
    const cityId = Number(id);
    if (isNaN(cityId)) throw new ApiError(400, 'Invalid city ID');
    await deleteCityService({ id: cityId });
    return apiMessage('City deleted successfully');
  } catch (err) {
    return handleError(err);
  }
}
