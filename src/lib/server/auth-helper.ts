import 'server-only';
import { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/server/utils/jwt.util';
import { AccessTokenPayload } from '@/lib/server/types/auth.types';
import { ApiError } from '@/lib/server/utils/ApiError';

export function getAuthUser(req: NextRequest): AccessTokenPayload {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'No token provided', [], 'NO_TOKEN');
  }
  const token = authHeader.split(' ')[1];
  return verifyAccessToken(token);
}

export function getOptionalAuthUser(req: NextRequest): AccessTokenPayload | null {
  try {
    return getAuthUser(req);
  } catch {
    return null;
  }
}

export function assertStudent(user: AccessTokenPayload): void {
  if (user.userType !== 'student') {
    throw new ApiError(403, 'Access denied. Students only.', [], 'INSUFFICIENT_PERMISSIONS');
  }
}

export function assertAdmin(user: AccessTokenPayload): void {
  if (user.userType !== 'admin') {
    throw new ApiError(403, 'Access denied. Admins only.', [], 'INSUFFICIENT_PERMISSIONS');
  }
}

export function assertSuperAdmin(user: AccessTokenPayload): void {
  if (user.userType !== 'admin' || user.role !== 'SUPERADMIN') {
    throw new ApiError(403, 'Access denied. Superadmin only.', [], 'INSUFFICIENT_PERMISSIONS');
  }
}

export function assertTeacherOrAbove(user: AccessTokenPayload): void {
  if (user.userType !== 'admin' || (user.role !== 'SUPERADMIN' && user.role !== 'TEACHER')) {
    throw new ApiError(403, 'Access denied. Teacher or Superadmin only.', [], 'INSUFFICIENT_PERMISSIONS');
  }
}

export function extractAdminContext(user: AccessTokenPayload) {
  return {
    admin: user,
    defaultBatchId: user.batchId,
    defaultBatchName: user.batchName,
    defaultBatchSlug: user.batchSlug,
    defaultCityId: user.cityId,
    defaultCityName: user.cityName,
  };
}

export function extractStudentContext(user: AccessTokenPayload) {
  return {
    student: user,
    studentId: user.id,
    batchId: user.batchId,
    batchName: user.batchName,
    batchSlug: user.batchSlug,
    cityId: user.cityId,
    cityName: user.cityName,
  };
}

export function getRefreshTokenFromRequest(req: NextRequest): string | null {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const match = cookieHeader.split(';').find(c => c.trim().startsWith('refreshToken='));
  return match?.split('=').slice(1).join('=').trim() ?? null;
}
