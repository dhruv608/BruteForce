/**
 * Student-specific user types
 */

export interface StudentUser {
  id: number;
  name: string;
  username: string;
  email?: string;
  leetcode_id?: string;
  gfg_id?: string;
  enrollment_id?: string;
  city?: {
    id: number;
    city_name: string;
  };
  batch?: {
    id: number;
    name: string;
    year: number;
  };
}
