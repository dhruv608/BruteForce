import 'server-only';
import { NextRequest } from 'next/server';
import { ApiError } from '@/lib/server/utils/ApiError';

export interface ParsedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export async function parseFormDataFile(
  req: NextRequest,
  fieldName: string,
  options: {
    allowedMimeTypes: string[];
    maxSizeBytes: number;
  }
): Promise<ParsedFile> {
  const formData = await req.formData().catch(() => {
    throw new ApiError(400, 'Invalid multipart form data');
  });

  const file = formData.get(fieldName) as File | null;
  if (!file) {
    throw new ApiError(400, `No file uploaded. Field name: "${fieldName}"`);
  }

  if (!options.allowedMimeTypes.includes(file.type)) {
    throw new ApiError(400, `Invalid file type. Allowed: ${options.allowedMimeTypes.join(', ')}`);
  }

  if (file.size > options.maxSizeBytes) {
    throw new ApiError(400, `File too large. Max size: ${Math.round(options.maxSizeBytes / 1024 / 1024)}MB`);
  }

  const arrayBuffer = await file.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    originalname: file.name,
    mimetype: file.type,
    size: file.size,
  };
}

export async function parseFormDataFileAny(
  req: NextRequest,
  fieldName: string
): Promise<ParsedFile> {
  const formData = await req.formData().catch(() => {
    throw new ApiError(400, 'Invalid multipart form data');
  });

  const file = formData.get(fieldName) as File | null;
  if (!file) {
    throw new ApiError(400, `No file uploaded. Field name: "${fieldName}"`);
  }

  const arrayBuffer = await file.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    originalname: file.name,
    mimetype: file.type,
    size: file.size,
  };
}

export async function parseFormDataWithFile(
  req: NextRequest,
  fileFieldName: string
): Promise<{ fields: Record<string, string>; file: ParsedFile | null }> {
  const formData = await req.formData().catch(() => {
    throw new ApiError(400, 'Invalid multipart form data');
  });

  const fields: Record<string, string> = {};
  let file: ParsedFile | null = null;

  for (const [key, value] of formData.entries()) {
    if (key === fileFieldName && value instanceof File) {
      const arrayBuffer = await value.arrayBuffer();
      file = {
        buffer: Buffer.from(arrayBuffer),
        originalname: value.name,
        mimetype: value.type,
        size: value.size,
      };
    } else if (typeof value === 'string') {
      fields[key] = value;
    }
  }

  return { fields, file };
}
