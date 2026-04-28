import 'server-only';
import { NextResponse } from 'next/server';
import { ApiError } from '@/lib/server/utils/ApiError';
import { ZodError } from 'zod';

export function handleError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
        code: err.code ?? 'ERROR',
        statusCode: err.statusCode,
        errors: err.errors ?? [],
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
      },
      { status: err.statusCode }
    );
  }

  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        errors: err.issues.map((e) => ({
          field: e.path.map((p) => String(p)).join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  const statusCode = (err as any)?.statusCode ?? 500;
  const message = err instanceof Error ? err.message : 'Something went wrong';
  const code = (err as any)?.code ?? 'INTERNAL_ERROR';

  return NextResponse.json(
    {
      success: false,
      message,
      code,
      statusCode,
      errors: [],
      ...(process.env.NODE_ENV !== 'production' && err instanceof Error && { stack: err.stack }),
    },
    { status: statusCode }
  );
}

export function formatZodErrors(error: ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((e) => ({
    field: e.path.map((p) => String(p)).join('.'),
    message: e.message,
  }));
}
