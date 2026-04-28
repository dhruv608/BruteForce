/**
 * Practice-related types for student
 */

export interface PracticeQuestion {
  id: string;
  question_name?: string;
  questionName?: string;
  platform: string;
  level: string;
  type: string;
  isSolved?: boolean;
  question_link?: string;
  questionLink?: string;
  isBookmarked?: boolean;
  topic?: {
    topic_name: string;
  };
}

export interface PracticeFilters {
  search?: string;
  topic?: string;
  level?: string;
  platform?: string;
  type?: string;
  solved?: string;
  page?: number;
  limit?: number;
}

export interface PracticeFilterOptions {
  levels: string[];
  platforms: string[];
  types: string[];
}

export interface PracticeDataResponse {
  questions: PracticeQuestion[];
  pagination?: {
    totalQuestions?: number;
    totalPages?: number;
    total?: number;
  };
  totalItems?: number;
  totalCount?: number;
  totalPages?: number;
  filters?: PracticeFilterOptions;
}

export interface PracticeResultsProps {
  loading: boolean;
  questions: PracticeQuestion[];
  onRefresh?: () => void;
}

export interface PracticeFiltersComponentProps {
  filters: PracticeFilters;
  filterOptions: PracticeFilterOptions;
  hasActiveFilters: boolean;
  handleFilterChange: (key: keyof PracticeFilters, value: unknown) => void;
  clearFilters: () => void;
}

export interface PracticeHeaderProps {
  // No props needed
}

export interface PracticeLoadingProps {
  // No props needed
}
