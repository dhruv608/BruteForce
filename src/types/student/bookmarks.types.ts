/**
 * Bookmarks-related types for student
 */

import { ApiError } from '../common/index.types';

export interface Question {
  id: number;
  question_name: string;
  question_link: string;
  platform: string;
  level: string;
  type: string;
}

export interface BookmarkRequest {
  question_id: number;
  description?: string;
}

export interface Bookmark {
  id: number;
  description: string | null;
  isSolved: boolean;
  created_at: string;
  question: Question;
}

export interface BookmarksResponse {
  bookmarks: Bookmark[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
  updatingBookmark: boolean;
}

export interface BookmarkFilterProps {
  sortBy: 'recent' | 'old';
  setSortBy: (value: 'recent' | 'old') => void;
  filterBy: 'all' | 'solved' | 'unsolved';
  setFilterBy: (value: 'all' | 'solved' | 'unsolved') => void;
}

export interface BookmarkHeaderProps {
  // No props needed
}

export interface BookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  onSubmit: (description: string) => Promise<void>;
  loading: boolean;
}

export interface EditBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark: Bookmark;
  onSubmit: (description: string) => Promise<void>;
  loading: boolean;
}

export interface BookmarkShimmerProps {
  // No props needed
}
