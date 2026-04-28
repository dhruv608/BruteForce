/**
 * Topics-related types for student
 */

export interface Topic {
  id: number;
  topic_name: string;
  slug: string;
  photo_url?: string;
  total_questions: number;
  solved_questions: number;
  total_classes: number;
  description?: string;
  classes?: unknown[];
  overallProgress?: {
    totalQuestions: number;
    solvedQuestions: number;
  };
  progress_percentage?: number;
  batchSpecificData?: {
    solvedQuestions?: number;
    totalQuestions?: number;
    totalClasses?: number;
  };
}

export interface TopicCardProps {
  topicSlug: string;
  topicName: string;
  photoUrl?: string;
  totalQuestions: number;
  solvedQuestions: number;
  totalClasses: number;
  progressPercentage?: number;
}

export interface TopicProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId?: number;
  username?: string;
}

export interface TopicsGridProps {
  topics: Topic[];
  searchQuery: string;
  pagination?: React.ReactNode;
}

export interface TopicsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (newSortBy: string) => void;
}

export interface TopicsLoadingProps {
  // No props needed
}

export interface TopicDataResponse {
  topics: Topic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
