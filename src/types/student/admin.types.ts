import { PracticeQuestion } from './practice.types';

export interface AdminStudent {
  id: number;
  name: string;
  email: string;
  username: string;
  enrollment_id: string;
  profile_image_url?: string | null;
  leetcode_id?: string | null;
  gfg_id?: string | null;
  totalSolved: number;
}

export interface AdminStudentsResponse {
  students: AdminStudent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Additional student-related types used across components
export interface RecentQuestion {
  id: number;
  question_name: string;
  question_link?: string;
  level: 'EASY' | 'MEDIUM' | 'HARD';
  platform: string;
  solvedAt: string;
}

export interface QuestionRowProps {
  questionName: string;
  platform: string;
  level: string;
  type: string;
  isSolved: boolean;
  link?: string;
  topicName?: string;
  questionId: number;
  isBookmarked: boolean;
  onBookmarkClick: (questionId: number, question: PracticeQuestion) => void;
}
