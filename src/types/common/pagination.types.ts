/**
 * Common pagination and filter types shared across all roles
 */

export interface PaginationState {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface FilterState {
  search: string;
}
