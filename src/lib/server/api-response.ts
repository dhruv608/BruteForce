import 'server-only';
import { NextResponse } from 'next/server';

/**
 * Unified API response envelope.
 * Every route returns { success, data, message? } via apiOk() / apiCreated().
 * Errors are returned by handleError() in error-response.ts as { success: false, ... }.
 */

export type ApiSuccess<T = unknown> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiFailure = {
  success: false;
  message: string;
  code?: string;
  statusCode: number;
  errors?: Array<{ field?: string; message: string }>;
};

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiFailure;

/**
 * Standard 200 OK response with optional message.
 *
 * @example
 *   return apiOk(cities);
 *   return apiOk(student, "Profile updated successfully");
 */
export function apiOk<T>(data: T, message?: string): NextResponse {
  const body: ApiSuccess<T> = { success: true, data, ...(message && { message }) };
  return NextResponse.json(body);
}

/**
 * 201 Created response with required message.
 *
 * @example
 *   return apiCreated(topic, "Topic created successfully");
 */
export function apiCreated<T>(data: T, message: string): NextResponse {
  return NextResponse.json<ApiSuccess<T>>(
    { success: true, data, message },
    { status: 201 }
  );
}

/**
 * Response with no body data (e.g. successful logout/delete).
 * Returns { success: true, data: null, message }.
 *
 * @example
 *   return apiMessage("Bookmark deleted successfully");
 */
export function apiMessage(message: string, status = 200): NextResponse {
  return NextResponse.json<ApiSuccess<null>>(
    { success: true, data: null, message },
    { status }
  );
}
