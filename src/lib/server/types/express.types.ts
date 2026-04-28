/**
 * Express Types - Replaced with Next.js-compatible equivalents
 * These types are kept for compatibility with services that import from here
 */

import { AdminRole } from "@prisma/client";
import { AccessTokenPayload } from './auth.types';
import { ParsedFile } from '@/lib/server/file-helper';

// Middleware-specific request interfaces (kept for type compatibility)
export interface AdminRequest {
  admin?: {
    id: number;
    email: string;
    name: string;
    role: AdminRole;
    city_id?: number;
    cityName?: string;
  };
}

export interface StudentRequest {
  user?: AccessTokenPayload & {
    userType: "student";
  };
  batchId?: number;
  batchName?: string;
}

// File upload types (Multer → ParsedFile)
export interface MulterFile {
  buffer: Buffer;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Request context types
export interface RequestWithUser {
  user: AccessTokenPayload;
}

export interface RequestWithAdmin {
  admin: {
    id: number;
    email: string;
    name: string;
    role: AdminRole;
    city_id?: number;
    cityName?: string;
  };
}

export interface RequestWithStudent {
  user: AccessTokenPayload & {
    userType: "student";
  };
  batchId?: number;
  batchName?: string;
}
