import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '@/lib/server/utils/ApiError';
import { applyRateLimit } from '@/lib/server/rate-limiter';
import { verifyAccessToken } from '@/lib/server/utils/jwt.util';
import { AccessTokenPayload } from '@/lib/server/types/auth.types';
import { handleError, formatZodErrors } from '@/lib/server/error-response';

type RateLimitName = 'api' | 'auth' | 'heavy';
type RequiredRole = 'student' | 'admin' | 'superadmin' | 'teacherOrAbove';

export interface HandlerContext {
  user?: AccessTokenPayload;
  body?: unknown;
  query: URLSearchParams;
  params: Record<string, string>;
  rawRequest: NextRequest;
}

export interface HandlerOptions {
  rateLimit?: RateLimitName;
  requireAuth?: boolean;
  requireRole?: RequiredRole;
  bodySchema?: ZodSchema;
  querySchema?: ZodSchema;
  paramsSchema?: ZodSchema;
}

function checkRole(user: AccessTokenPayload, role: RequiredRole): void {
  switch (role) {
    case 'student':
      if (user.userType !== 'student') {
        throw new ApiError(403, 'Access denied. Students only.', [], 'INSUFFICIENT_PERMISSIONS');
      }
      break;
    case 'admin':
      if (user.userType !== 'admin') {
        throw new ApiError(403, 'Access denied. Admins only.', [], 'INSUFFICIENT_PERMISSIONS');
      }
      break;
    case 'superadmin':
      if (user.userType !== 'admin' || user.role !== 'SUPERADMIN') {
        throw new ApiError(403, 'Access denied. Superadmin only.', [], 'INSUFFICIENT_PERMISSIONS');
      }
      break;
    case 'teacherOrAbove':
      if (user.userType !== 'admin' || (user.role !== 'SUPERADMIN' && user.role !== 'TEACHER')) {
        throw new ApiError(403, 'Access denied. Teacher or Superadmin only.', [], 'INSUFFICIENT_PERMISSIONS');
      }
      break;
  }
}

export function withHandler(
  handler: (ctx: HandlerContext) => Promise<NextResponse>,
  options: HandlerOptions = {}
) {
  return async (
    req: NextRequest,
    routeCtx: { params?: Promise<Record<string, string>> | Record<string, string> } = {}
  ): Promise<NextResponse> => {
    try {
      // 1. Rate limiting
      if (options.rateLimit) {
        const limited = await applyRateLimit(req, options.rateLimit);
        if (limited) return limited;
      }

      // 2. Auth verification
      let user: AccessTokenPayload | undefined;
      if (options.requireAuth) {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          throw new ApiError(401, 'No token provided', [], 'NO_TOKEN');
        }
        const token = authHeader.split(' ')[1];
        user = verifyAccessToken(token);
      }

      // 3. Role check
      if (options.requireRole && user) {
        checkRole(user, options.requireRole);
      }

      // 4. Body parsing + Zod validation
      let body: unknown;
      if (options.bodySchema && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
        let raw: unknown;
        const contentType = req.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
          raw = await req.json().catch(() => ({}));
        } else {
          raw = {};
        }
        const result = options.bodySchema.safeParse(raw);
        if (!result.success) {
          throw new ApiError(
            400,
            'Validation failed',
            formatZodErrors(result.error),
            'VALIDATION_ERROR'
          );
        }
        body = result.data;
      }

      // 5. Query validation
      const querySearchParams = new URL(req.url).searchParams;
      if (options.querySchema) {
        const rawQuery = Object.fromEntries(querySearchParams.entries());
        const result = options.querySchema.safeParse(rawQuery);
        if (!result.success) {
          throw new ApiError(
            400,
            'Invalid query parameters',
            formatZodErrors(result.error),
            'VALIDATION_ERROR'
          );
        }
      }

      // 6. Resolve dynamic route params
      let params: Record<string, string> = {};
      if (routeCtx.params) {
        // Next.js 15+ returns params as a Promise
        params = routeCtx.params instanceof Promise
          ? await routeCtx.params
          : routeCtx.params;
      }

      // 7. Params validation
      if (options.paramsSchema) {
        const result = options.paramsSchema.safeParse(params);
        if (!result.success) {
          throw new ApiError(
            400,
            'Invalid URL parameters',
            formatZodErrors(result.error),
            'VALIDATION_ERROR'
          );
        }
      }

      // 8. Call the handler
      const ctx: HandlerContext = {
        user,
        body,
        query: querySearchParams,
        params,
        rawRequest: req,
      };

      return await handler(ctx);
    } catch (err) {
      return handleError(err);
    }
  };
}

export function setRefreshTokenCookie(response: NextResponse, refreshToken: string): void {
  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export function clearRefreshTokenCookie(response: NextResponse): void {
  response.cookies.set('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
