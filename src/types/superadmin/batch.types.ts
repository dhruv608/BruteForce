/**
 * Batch management form types for superadmin
 */

export interface BatchFormData {
  batch_name: string;
  year: number;
  city_id: string;
}

export interface BatchSubmitPayload {
  batch_name: string;
  year: number;
  city_id: number;
}

export interface BatchQueryParams {
  city?: string;
  year?: number;
}

export interface Batch {
  id: number;
  batch_name: string;
  year: number;
  city_id: number;
  city?: {
    id: number;
    city_name: string;
  };
  slug: string;
  _count?: {
    students: number;
    classes: number;
  };
  createdAt?: string;
  updatedAt?: string;
}
